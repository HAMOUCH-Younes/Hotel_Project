<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Room;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        \Log::info('Received booking request:', $request->all()); // Add logging for debugging

        $validated = $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'check_in' => 'required|date|after:today',
            'check_out' => 'required|date|after:check_in',
            'phone_number' => 'required|string|max:15',
            'guests' => 'required|integer|min:1',
            'total_price' => 'required|numeric',
            'full_name' => 'required|string|max:255', // Add validation for other fields
            'email' => 'nullable|email',
            'payment_method' => 'required|in:online,on_arrival',
            'additional_notes' => 'nullable|string',
            'number_of_nights' => 'required|integer|min:1',
        ]);

        $isAvailable = Booking::where('room_id', $request->room_id)
            ->where(function ($query) use ($request) {
                $query->whereBetween('check_in', [$request->check_in, $request->check_out])
                      ->orWhereBetween('check_out', [$request->check_in, $request->check_out])
                      ->orWhere(function ($q) use ($request) {
                          $q->where('check_in', '<=', $request->check_in)
                            ->where('check_out', '>=', $request->check_out);
                      });
            })->doesntExist();

        if (!$isAvailable) {
            return response()->json(['error' => 'Room not available for the selected dates'], 422);
        }

        $room = Room::findOrFail($request->room_id);
        if ($request->guests > $room->max_guests) {
            return response()->json(['error' => 'Guest count exceeds room capacity'], 422);
        }

        $checkIn = new \DateTime($request->check_in);
        $checkOut = new \DateTime($request->check_out);
        $days = $checkOut->diff($checkIn)->days;
        $total_price = $room->price_per_night * $days;

        // Use validated data and add computed fields
        $bookingData = array_merge($validated, [
            'user_id' => auth()->id(),
            'total_price' => $total_price, // Override with computed value
            'status' => 'pending',
        ]);

        $booking = Booking::create($bookingData);

        return response()->json([
            'message' => 'Booking created successfully',
            'data' => $booking,
        ], 201);
    }

    public function index(Request $request)
    {
        $userId = auth()->id();
        $bookings = Booking::with('room.hotel')
            ->where('user_id', $userId)
            ->get();

        return response()->json(['data' => $bookings], 200);
    }

    public function destroy($id)
    {
        $userId = auth()->id();
        $booking = Booking::where('id', $id)
            ->where('user_id', $userId)
            ->firstOrFail();

        if ($booking->status !== 'pending') {
            return response()->json(['error' => 'Only pending bookings can be cancelled'], 403);
        }

        $booking->delete();

        return response()->json(['message' => 'Booking cancelled successfully'], 200);
    }
}
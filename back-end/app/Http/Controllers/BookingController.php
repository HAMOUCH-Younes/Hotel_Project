<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        if ($user->role === 'admin') {
            $bookings = Booking::with('room.hotel', 'user', 'user.userDetail')->get();
        } else {
            $userId = $user->id;
            $bookings = Booking::with('room.hotel', 'user', 'user.userDetail')
                ->where('user_id', $userId)
                ->get();
        }

        return response()->json(['data' => $bookings], 200);
    }

    public function adminIndex(Request $request)
    {
        $bookings = Booking::with('room.hotel', 'user', 'user.userDetail')->get();
        return response()->json(['data' => $bookings], 200);
    }

    public function store(Request $request)
    {
        Log::info('Received booking request:', $request->all());

        $validated = $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'check_in' => 'required|date|after:today',
            'check_out' => 'required|date|after:check_in',
            'phone_number' => 'required|string|max:15',
            'guests' => 'required|integer|min:1',
            'total_price' => 'required|numeric',
            'full_name' => 'required|string|max:255',
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

        $bookingData = array_merge($validated, [
            'user_id' => auth()->id(),
            'total_price' => $total_price,
            'status' => 'pending',
        ]);

        $booking = Booking::create($bookingData);

        return response()->json([
            'message' => 'Booking created successfully',
            'data' => $booking->load('room.hotel', 'user', 'user.userDetail'),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);

        $validated = $request->validate([
            'room_id' => 'sometimes|exists:rooms,id',
            'check_in' => 'sometimes|date|after:today',
            'check_out' => 'sometimes|date|after:check_in',
            'phone_number' => 'sometimes|string|max:15',
            'guests' => 'sometimes|integer|min:1',
            'total_price' => 'sometimes|numeric',
            'full_name' => 'sometimes|string|max:255',
            'email' => 'nullable|email',
            'payment_method' => 'sometimes|in:online,on_arrival',
            'additional_notes' => 'nullable|string',
            'number_of_nights' => 'sometimes|integer|min:1',
            'status' => 'sometimes|in:pending,confirmed,cancelled',
        ]);

        if (isset($validated['room_id']) || isset($validated['check_in']) || isset($validated['check_out'])) {
            $room_id = $validated['room_id'] ?? $booking->room_id;
            $check_in = $validated['check_in'] ?? $booking->check_in;
            $check_out = $validated['check_out'] ?? $booking->check_out;

            $isAvailable = Booking::where('room_id', $room_id)
                ->where('id', '!=', $id)
                ->where(function ($query) use ($check_in, $check_out) {
                    $query->whereBetween('check_in', [$check_in, $check_out])
                          ->orWhereBetween('check_out', [$check_in, $check_out])  
                          ->orWhere(function ($q) use ($check_in, $check_out) {
                              $q->where('check_in', '<=', $check_in)
                                ->where('check_out', '>=', $check_out);
                          });
                })->doesntExist();

            if (!$isAvailable) {
                return response()->json(['error' => 'Room not available for the selected dates'], 422);
            }
        }

        if (isset($validated['room_id']) || isset($validated['guests']) || isset($validated['check_in']) || isset($validated['check_out'])) {
            $room = Room::findOrFail($validated['room_id'] ?? $booking->room_id);
            $guests = $validated['guests'] ?? $booking->guests;
            if ($guests > $room->max_guests) {
                return response()->json(['error' => 'Guest count exceeds room capacity'], 422);
            }

            $checkIn = new \DateTime($validated['check_in'] ?? $booking->check_in);
            $checkOut = new \DateTime($validated['check_out'] ?? $booking->check_out);
            $days = $checkOut->diff($checkIn)->days;
            $validated['total_price'] = $room->price_per_night * $days;
            $validated['number_of_nights'] = $days;
        }

        $booking->update($validated);

        return response()->json([
            'message' => 'Booking updated successfully',
            'data' => $booking->load('room.hotel', 'user', 'user.userDetail'),
        ], 200);
    }

    public function destroy($id)
    {
        $user = auth()->user();
        $booking = Booking::findOrFail($id);

        // Allow admins to delete any booking, regular users can only delete their own
        if ($user->role !== 'admin' && $booking->user_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if ($booking->status !== 'pending' && $booking->status !== 'cancelled') {
            return response()->json(['error' => 'Only pending or cancelled bookings can be deleted'], 403);
        }

        $booking->delete();

        return response()->json(['message' => 'Booking deleted successfully'], 200);
    }

    public function toggleStatus($id)
    {
        $booking = Booking::findOrFail($id);
        $user = auth()->user();

        // Restrict to admins only
        if ($user->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if ($booking->status === 'pending') {
            $booking->status = 'confirmed';
        } elseif ($booking->status === 'confirmed') {
            $booking->status = 'cancelled';
        } elseif ($booking->status === 'cancelled') {
            $booking->status = 'confirmed';
        }

        $booking->save();

        return response()->json([
            'message' => 'Booking status updated successfully',
            'data' => $booking->load('room.hotel', 'user', 'user.userDetail'),
        ], 200);
    }
}
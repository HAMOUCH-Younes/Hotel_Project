<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\Booking; // Assuming a Booking model exists
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function index(Request $request)
    {
        $query = Room::with(['hotel', 'amenities', 'images']);

        // Filters for hotel_id, price_min, price_max, amenity_ids, sort
        if ($request->has('hotel_id')) {
            $query->where('hotel_id', $request->hotel_id);
        }
        if ($request->has('price_min')) {
            $query->where('price_per_night', '>=', $request->price_min);
        }
        if ($request->has('price_max')) {
            $query->where('price_per_night', '<=', $request->price_max);
        }
        if ($request->has('amenity_ids')) {
            $query->whereHas('amenities', function ($q) use ($request) {
                $q->whereIn('amenities.id', explode(',', $request->amenity_ids));
            });
        }
        if ($request->has('sort')) {
            if ($request->sort === 'Price Low to High') {
                $query->orderBy('price_per_night', 'asc');
            } elseif ($request->sort === 'Price High to Low') {
                $query->orderBy('price_per_night', 'desc');
            } elseif ($request->sort === 'Newest First') {
                $query->orderBy('created_at', 'desc');
            }
        }
        if ($request->has('limit')) {
            $query->take($request->query('limit'));
        }
        $rooms = $query->get()->map(function ($room) {
            $room->image = $room->images->first()?->image ?? null;
            return $room;
        });

        return response()->json($rooms);
    }

    public function show($id)
    {
        $room = Room::with(['hotel', 'amenities', 'images'])->findOrFail($id);
        $room->image = $room->images->first()?->image ?? null;
        return response()->json($room);
    }

    public function checkAvailability(Request $request, $id)
    {
        $room = Room::findOrFail($id);

        $validated = $request->validate([
            'check_in' => 'required|date',
            'check_out' => 'required|date|after:check_in',
            'guests' => 'required|integer|min:1|max:' . $room->max_guests,
        ]);

        $checkIn = new \DateTime($validated['check_in']);
        $checkOut = new \DateTime($validated['check_out']);

        // Check for overlapping bookings
        $overlappingBookings = Booking::where('room_id', $room->id)
            ->where(function ($query) use ($checkIn, $checkOut) {
                $query->whereBetween('check_in', [$checkIn, $checkOut])
                      ->orWhereBetween('check_out', [$checkIn, $checkOut])
                      ->orWhere(function ($query) use ($checkIn, $checkOut) {
                          $query->where('check_in', '<=', $checkIn)
                                ->where('check_out', '>=', $checkOut);
                      });
            })
            ->exists();

        if ($overlappingBookings) {
            return response()->json([
                'available' => false,
                'message' => 'Room is not available for the selected dates.',
            ], 200);
        }

        return response()->json([
            'available' => true,
            'message' => 'Room is available for the selected dates!',
        ], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'hotel_id' => 'required|exists:hotels,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price_per_night' => 'required|numeric|min:0',
            'max_guests' => 'required|integer|min:1',
            'amenity_ids' => 'nullable|array',
            'amenity_ids.*' => 'exists:amenities,id',
        ]);

        $room = Room::create($validated);

        if (!empty($validated['amenity_ids'])) {
            $room->amenities()->attach($validated['amenity_ids']);
        }

        return response()->json($room->load(['hotel', 'amenities', 'images']), 201);
    }

    public function update(Request $request, $id)
    {
        $room = Room::findOrFail($id);

        $validated = $request->validate([
            'hotel_id' => 'sometimes|exists:hotels,id',
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'price_per_night' => 'sometimes|numeric|min:0',
            'max_guests' => 'sometimes|integer|min:1',
            'amenity_ids' => 'nullable|array',
            'amenity_ids.*' => 'exists:amenities,id',
        ]);

        $room->update($validated);

        if (isset($validated['amenity_ids'])) {
            $room->amenities()->sync($validated['amenity_ids']);
        }

        return response()->json($room->load(['hotel', 'amenities', 'images']));
    }

    public function destroy($id)
    {
        $room = Room::findOrFail($id);
        $room->delete();

        return response()->json(['message' => 'Room deleted successfully']);
    }
}
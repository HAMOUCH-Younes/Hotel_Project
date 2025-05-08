<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function index(Request $request)
    {
        $query = Room::with(['hotel', 'amenities']);

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

        $rooms = $query->get();
        return response()->json($rooms);
    }

    public function show($id)
    {
        $room = Room::with(['hotel', 'amenities'])->findOrFail($id);
        return response()->json($room);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'hotel_id' => 'required|exists:hotels,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price_per_night' => 'required|numeric|min:0',
            'max_guests' => 'required|integer|min:1',
            'image' => 'nullable|string',
            'amenity_ids' => 'nullable|array',
            'amenity_ids.*' => 'exists:amenities,id',
        ]);

        $room = Room::create($validated);

        if (!empty($validated['amenity_ids'])) {
            $room->amenities()->attach($validated['amenity_ids']);
        }

        return response()->json($room->load(['hotel', 'amenities']), 201);
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
            'image' => 'nullable|string',
            'amenity_ids' => 'nullable|array',
            'amenity_ids.*' => 'exists:amenities,id',
        ]);

        $room->update($validated);

        if (isset($validated['amenity_ids'])) {
            $room->amenities()->sync($validated['amenity_ids']);
        }

        return response()->json($room->load(['hotel', 'amenities']));
    }

    public function destroy($id)
    {
        $room = Room::findOrFail($id);
        $room->delete();

        return response()->json(['message' => 'Room deleted successfully']);
    }
}
<?php

namespace App\Http\Controllers;

use App\Models\Hotel;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;

class HotelController extends Controller
{
    public function index(Request $request)
    {
        try {
            $limit = $request->query('limit', 4);
            $query = Hotel::with(['rooms']);

            $hotels = $query->take($limit)->get();

            return response()->json($hotels);
        } catch (\Exception $e) {
            Log::error('Failed to fetch hotels: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to fetch hotels.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $hotel = Hotel::with(['rooms'])->findOrFail($id);
            return response()->json($hotel);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Hotel not found.',
                'message' => 'The hotel with ID ' . $id . ' does not exist.',
            ], 404);
        } catch (\Exception $e) {
            Log::error('Failed to fetch hotel details: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to fetch hotel details.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'address' => 'required|string|max:255',
                'city' => 'required|string|max:100',
                'country' => 'required|string|max:100',
                'rating' => 'nullable|numeric|min:0|max:5',
                'is_best_seller' => 'boolean',
                'image' => 'nullable|url', // Single image URL
            ]);

            $hotel = Hotel::create($validated);

            $hotel->load(['rooms']);

            return response()->json($hotel, 201);
        } catch (\ValidationException $e) {
            Log::warning('Validation failed for hotel creation: ' . json_encode($e->errors()));
            return response()->json([
                'error' => 'Validation failed.',
                'message' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Failed to create hotel: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to create hotel.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $hotel = Hotel::findOrFail($id);

            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'description' => 'nullable|string',
                'address' => 'sometimes|string|max:255',
                'city' => 'sometimes|string|max:100',
                'country' => 'sometimes|string|max:100',
                'rating' => 'nullable|numeric|min:0|max:5',
                'is_best_seller' => 'boolean',
                'image' => 'nullable', // Single image URL
            ]);

            $hotel->update($validated);

            $hotel->load(['rooms']);

            return response()->json($hotel);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Hotel not found.',
                'message' => 'The hotel with ID ' . $id . ' does not exist.',
            ], 404);
        } catch (\ValidationException $e) {
            Log::warning('Validation failed for hotel update: ' . json_encode($e->errors()));
            return response()->json([
                'error' => 'Validation failed.',
                'message' => $e->errors(),
            ], 422); // Changed from 500 to 422 for validation errors
        } catch (\Exception $e) {
            Log::error('Failed to update hotel: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to update hotel.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $hotel = Hotel::findOrFail($id);
            $hotel->delete();

            return response()->json(['message' => 'Hotel deleted successfully']);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Hotel not found.',
                'message' => 'The hotel with ID ' . $id . ' does not exist.',
            ], 404);
        } catch (\Exception $e) {
            Log::error('Failed to delete hotel: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to delete hotel.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
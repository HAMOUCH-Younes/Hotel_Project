<?php

namespace App\Http\Controllers;

use App\Models\Offer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class OfferController extends Controller
{
    public function index(Request $request)
    {
        $query = Offer::with(['hotel']);

        if ($request->has('hotel_id')) {
            $query->where('hotel_id', $request->hotel_id);
        }

        if ($request->has('active')) {
            $query->where('expires_at', '>=', now());
        }

        $offers = $query->get();
        return response()->json($offers);
    }

    public function show($id)
    {
        $offer = Offer::with(['hotel'])->findOrFail($id);
        return response()->json($offer);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string|max:1000',
                'discount_percentage' => 'required|numeric|min:0|max:100',
                'expires_at' => 'required|date',
                'image' => 'required|url',
                'hotel_id' => 'required|exists:hotels,id',
            ]);

            $offer = Offer::create($validated);
            $offer->load('hotel');
            return response()->json($offer, 201);
        } catch (\Exception $e) {
            Log::error('Failed to create offer: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to create offer.'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $offer = Offer::findOrFail($id);

            $validated = $request->validate([
                'title' => 'sometimes|string|max:255',
                'description' => 'sometimes|string|max:1000',
                'discount_percentage' => 'sometimes|numeric|min:0|max:100',
                'expires_at' => 'sometimes|date',
                'image' => 'sometimes|url',
                'hotel_id' => 'sometimes|exists:hotels,id',
            ]);

            $offer->update($validated);
            $offer->load('hotel');
            return response()->json($offer);
        } catch (\Exception $e) {
            Log::error('Failed to update offer: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update offer.'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $offer = Offer::findOrFail($id);
            $offer->delete();
            return response()->json(['message' => 'Offer deleted successfully']);
        } catch (\Exception $e) {
            Log::error('Failed to delete offer: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to delete offer.'], 500);
        }
    }
}
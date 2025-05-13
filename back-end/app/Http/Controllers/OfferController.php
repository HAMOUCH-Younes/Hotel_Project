<?php

namespace App\Http\Controllers;

use App\Models\Offer;
use Illuminate\Http\Request;

class OfferController extends Controller
{
    public function index(Request $request)
    {
        $query = Offer::with(['hotel']);

        // Optional: Filter by hotel_id if provided
        if ($request->has('hotel_id')) {
            $query->where('hotel_id', $request->hotel_id);
        }

        // Optional: Only show active offers (not expired)
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
}
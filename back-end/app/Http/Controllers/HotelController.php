<?php

namespace App\Http\Controllers;

use App\Models\Hotel;
use Illuminate\Http\Request;

class HotelController extends Controller
{
    public function index(Request $request)
    {
        $query = Hotel::with(['rooms']);

        // Apply limit if provided (default to 4 for Hotels page)
        $limit = $request->query('limit', 4);
        $query->take($limit);

        $hotels = $query->get();
        return response()->json($hotels);
    }

    public function show($id)
    {
        $hotel = Hotel::with(['rooms'])->findOrFail($id);
        return response()->json($hotel);
    }
}
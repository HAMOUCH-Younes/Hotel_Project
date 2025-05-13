<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $query = Review::with(['user', 'hotel']);

        // Filter by hotel_id if provided
        if ($request->has('hotel_id')) {
            $query->where('hotel_id', $request->hotel_id);
        }

        // Limit number of reviews if provided
        if ($request->has('limit')) {
            $query->take((int)$request->query('limit'));
        }

        $reviews = $query->get();
        return response()->json($reviews);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Validate the incoming request data
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'hotel_id' => 'required|exists:hotels,id',
            'rating' => 'required|integer|between:1,5',
            'comment' => 'required|string|max:1000',
        ]);

        // Create the review
        $review = Review::create($validated);

        // Load relationships for the response
        $review->load(['user', 'hotel']);

        return response()->json([
            'message' => 'Review created successfully.',
            'review' => $review,
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $review = Review::with(['user', 'hotel'])->findOrFail($id);
        return response()->json($review);
    }
}
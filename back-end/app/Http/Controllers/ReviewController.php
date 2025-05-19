<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ReviewController extends Controller
{
    /**
     * Display a listing of the resource for public (filtered by hotel if provided).
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        try {
            $query = Review::with(['user.userDetail', 'hotel']);

            if ($request->has('hotel_id')) {
                $query->where('hotel_id', $request->hotel_id);
            }

            if ($request->has('limit')) {
                $query->take((int)$request->query('limit'));
            }

            $reviews = $query->get();
            return response()->json($reviews);
        } catch (\Exception $e) {
            Log::error('Failed to fetch reviews: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to fetch reviews.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display reviews for the testimonials page (public).
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function testimonials(Request $request)
    {
        try {
            $query = Review::with(['user.userDetail', 'hotel'])
                ->where('show_on_testimonial', true)
                ->orderBy('created_at', 'desc') // Sort by creation date, newest first
                ->take(3);

            $reviews = $query->get();
            return response()->json($reviews);
        } catch (\Exception $e) {
            Log::error('Failed to fetch testimonials: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to fetch testimonials.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'hotel_id' => 'required|exists:hotels,id',
            'rating' => 'required|integer|between:1,5',
            'comment' => 'required|string|max:1000',
            'show_on_testimonial' => 'boolean',
        ]);

        $review = Review::create($validated);
        $review->load(['user.userDetail', 'hotel']);
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
        $review = Review::with(['user.userDetail', 'hotel'])->findOrFail($id);
        return response()->json($review);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        try {
            $review = Review::findOrFail($id);
            $validated = $request->validate([
                'show_on_testimonial' => 'boolean',
            ]);

            if ($validated['show_on_testimonial'] && Review::where('show_on_testimonial', true)->count() >= 3) {
                return response()->json([
                    'error' => 'Maximum of 3 reviews can be shown on the testimonial page.',
                ], 400);
            }

            $review->update($validated);
            $review->load(['user.userDetail', 'hotel']);
            return response()->json($review);
        } catch (\Exception $e) {
            Log::error('Failed to update review: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update review.'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $review = Review::findOrFail($id);
            $review->delete();
            return response()->json(['message' => 'Review deleted successfully']);
        } catch (\Exception $e) {
            Log::error('Failed to delete review: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to delete review.'], 500);
        }
    }
}
<?php

namespace App\Http\Controllers;

use App\Models\NewsletterSubscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NewsletterSubscriptionController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:newsletter_subscriptions,email',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 422);
        }

        try {
            NewsletterSubscription::create([
                'email' => $request->email,
            ]);

            return response()->json(['message' => 'Subscription successful!'], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'An error occurred. Please try again.'], 500);
        }
    }
}
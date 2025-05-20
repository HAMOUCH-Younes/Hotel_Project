<?php

namespace App\Http\Controllers;

use App\Models\Newsletter;
use App\Models\NewsletterSubscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\SubscriberNewsletter;
use Illuminate\Support\Facades\Log;

class NewsletterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $newsletters = Newsletter::orderBy('sent_at', 'desc')->get();
            return response()->json($newsletters);
        } catch (\Exception $e) {
            Log::error('Failed to fetch newsletters: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch newsletters.'], 500);
        }
    }

    /**
     * Store a newly created resource in storage and send to subscribers.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'subject' => 'required|string|max:255',
                'message' => 'required|string',
            ]);

            // Create the newsletter record
            $newsletter = Newsletter::create([
                'subject' => $validated['subject'],
                'message' => $validated['message'],
                'sent_at' => now(),
            ]);

            // Fetch all subscribers
            $subscribers = NewsletterSubscription::all();

            // Send email to each subscriber
            foreach ($subscribers as $subscriber) {
                try {
                    Mail::to($subscriber->email)->queue(new SubscriberNewsletter(
                        $newsletter->subject,
                        $newsletter->message
                    ));
                } catch (\Exception $e) {
                    Log::error('Failed to send newsletter to ' . $subscriber->email . ': ' . $e->getMessage());
                }
            }

            return response()->json([
                'message' => 'Newsletter sent successfully to subscribers.',
                'newsletter' => $newsletter,
            ], 201);
        } catch (\Exception $e) {
            Log::error('Failed to send newsletter: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to send newsletter.'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $newsletter = Newsletter::findOrFail($id);
            $newsletter->delete();

            return response()->json(['message' => 'Newsletter deleted successfully.']);
        } catch (\Exception $e) {
            Log::error('Failed to delete newsletter: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to delete newsletter.'], 500);
        }
    }
}
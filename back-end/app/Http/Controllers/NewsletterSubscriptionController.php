<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NewsletterSubscription;
use Illuminate\Support\Facades\Mail;
use App\Mail\AdminNewSubscription;

class NewsletterSubscriptionController extends Controller
{
    public function subscribe(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:newsletter_subscriptions,email',
        ]);

        $subscription = NewsletterSubscription::create([
            'email' => $request->email,
        ]);

        // Send notification email to admin
        $adminEmail = config('mail.admin_email'); // خلي هاد القيمة في config/mail.php

        if ($adminEmail) {
            Mail::to($adminEmail)->send(new AdminNewSubscription($subscription));
        }

        return response()->json(['message' => 'Subscribed successfully']);
    }
}

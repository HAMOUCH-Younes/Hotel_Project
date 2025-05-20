@component('mail::message')
@component('mail::header', ['url' => config('app.url')])
<img src="https://plus.unsplash.com/premium_photo-1669077046750-bef49171b059?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bG9nbyUyMGhvdGVsfGVufDB8fDB8fHww" alt="QuickStay Logo" style="display:block; margin: 0 auto; max-width: 150px; height:auto;">
@endcomponent

<div style="text-align:center;">
    <h1 style="font-size:24px; color:#2b6cb0; font-weight:bold; margin-bottom:10px;">
        {{ $subject }}
    </h1>
</div>

<div style="background:#f7fafc; border-left:4px solid #2b6cb0; padding:20px; font-size:16px; line-height:1.6; color:#2d3748; margin-bottom: 25px;">
    {!! nl2br(e($message)) !!}
</div>

@component('mail::button', ['url' => url('/'), 'color' => 'blue'])
🌐 Explore QuickStay
@endcomponent

<hr style="margin: 40px 0; border: none; border-top: 1px solid #e2e8f0;">

<div style="text-align:center; color:#4a5568; font-size: 14px; margin-bottom: 10px;">
    ✈️ <strong>Thank you</strong> for being part of the QuickStay community.<br>
    <strong style="color:#2b6cb0;">Stay tuned</strong> for more exclusive deals and travel inspiration!
</div>

<p style="text-align:center; color:#a0aec0; font-size:12px; margin-top:30px;">
    &copy; {{ date('Y') }} QuickStay. All rights reserved.<br>
    <a href="{{ url('/unsubscribe') }}" style="color:#3182ce; text-decoration:none;">Unsubscribe</a> |
    <a href="{{ url('/privacy') }}" style="color:#3182ce; text-decoration:none;">Privacy Policy</a> |
    <a href="{{ url('/terms') }}" style="color:#3182ce; text-decoration:none;">Terms of Service</a>
</p>
@endcomponent

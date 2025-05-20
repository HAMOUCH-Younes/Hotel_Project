@component('mail::message')
@component('mail::header', ['url' => config('app.url')])
    <img src="https://plus.unsplash.com/premium_photo-1669077046750-bef49171b059?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bG9nbyUyMGhvdGVsfGVufDB8fDB8fHww" alt="QuickStay Logo" style="display: block; margin: 0 auto;" width="150" height="50">
@endcomponent

# {{ $subject }}

@component('mail::panel', ['padding' => '20px'])
<div style="line-height: 1.6; color: #4a5568;">
    {!! nl2br(e($message)) !!}
</div>
@endcomponent

@component('mail::button', ['url' => url('/'), 'color' => 'blue'])
Visit QuickStay
@endcomponent

<div style="text-align: center; margin-top: 20px; color: #718096;">
    Stay updated with our latest offers and travel tips by keeping your subscription active!
</div>

<p style="text-align: center; color: #718096; font-size: 12px; margin-top: 30px;">
    Thanks,<br>
    {{ config('app.name') }}<br><br>
    © {{ date('Y') }} {{ config('app.name') }}. All rights reserved.<br>
    <a href="{{ url('/unsubscribe') }}" style="color: #3182ce; text-decoration: none;">Unsubscribe</a> | 
    <a href="{{ url('/privacy') }}" style="color: #3182ce; text-decoration: none;">Privacy Policy</a> | 
    <a href="{{ url('/terms') }}" style="color: #3182ce; text-decoration: none;">Terms of Service</a>
</p>
@endcomponent
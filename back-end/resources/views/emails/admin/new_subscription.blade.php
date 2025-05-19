@component('mail::message')
# New Offer Available at QuickStay!

We’re excited to share a new offer with you:

**{{ $offer->title }}**

**Discount:** {{ $offer->discount_percentage }}% off  
**Valid Until:** {{ $offer->valid_until }}

[Check Out the Offer Now]({{ url('/offers/' . $offer->id) }})

Don’t miss out on this amazing deal!

Thanks,  
{{ config('app.name') }}
@endcomponent
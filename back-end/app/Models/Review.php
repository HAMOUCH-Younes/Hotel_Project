<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = ['user_id', 'hotel_id', 'rating', 'comment', 'show_on_testimonial'];

    // Ensure timestamps are used (default is true)
    public $timestamps = true;

    // Cast show_on_testimonial to boolean to avoid null issues
    protected $casts = [
        'show_on_testimonial' => 'boolean',
    ];

    // Define default value for show_on_testimonial
    protected $attributes = [
        'show_on_testimonial' => false,
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function hotel()
    {
        return $this->belongsTo(Hotel::class);
    }

    // Optional: Scope for testimonials
    public function scopeForTestimonials($query)
    {
        return $query->where('show_on_testimonial', true)->orderBy('created_at', 'desc')->take(3);
    }
}
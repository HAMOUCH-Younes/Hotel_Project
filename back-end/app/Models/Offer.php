<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Offer extends Model
{
    protected $fillable = ['hotel_id', 'title', 'description', 'discount_percentage', 'expires_at'];
    
    public function hotel()
    {
        return $this->belongsTo(Hotel::class);
    }
}
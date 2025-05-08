<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hotel extends Model
{
    protected $fillable = ['name', 'description', 'address', 'city', 'country', 'rating', 'image', 'is_best_seller'];
    
    public function rooms()
    {
        return $this->hasMany(Room::class);
    }
    
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
    
    public function offers()
    {
        return $this->hasMany(Offer::class);
    }
}
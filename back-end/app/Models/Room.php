<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    protected $fillable = ['hotel_id', 'name', 'description', 'price_per_night', 'max_guests'];
    
    public function hotel()
    {
        return $this->belongsTo(Hotel::class);
    }
    
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
    
    public function amenities()
    {
        return $this->belongsToMany(Amenity::class, 'room_amenities');
    }

    // العلاقة مع الصور
    public function images()
    {
        return $this->hasMany(RoomImage::class);
    }
}

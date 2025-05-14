<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserDetail extends Model
{
    protected $fillable = [
        'first_name',
        'middle_name',
        'bio',
        'date_of_birth',
        'sex',
        'accessibility_needs',
        'phone_number',
        'emergency_contact',
        'address',
        'cin',
        'icon',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
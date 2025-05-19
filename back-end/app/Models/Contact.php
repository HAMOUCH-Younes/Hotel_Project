<?php

  namespace App\Models;

  use Illuminate\Database\Eloquent\Factories\HasFactory;
  use Illuminate\Database\Eloquent\Model;

  class Contact extends Model
  {
      use HasFactory;

      protected $fillable = [
          'user_id',
          'phone_country_code',
          'phone_number',
          'sms_updates',
          'emergency_contact_name',
          'emergency_country_code',
          'emergency_number',
          'email',
          'country',
          'address',
          'address_details',
          'city',
          'state',
          'postal_code',
          'name', // Added to allow mass assignment
      ];

      public function user()
      {
          return $this->belongsTo(User::class);
      }
  
    public function userDetail()
    {
        return $this->hasOne(UserDetail::class);
    }
}

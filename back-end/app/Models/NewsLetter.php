<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Newsletter extends Model
{
    protected $fillable = ['subject', 'message', 'sent_at'];

    protected $dates = ['sent_at'];
}
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateContactsTable extends Migration
{
    public function up()
    {
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Links to users table
            $table->string('phone_country_code')->nullable();
            $table->string('phone_number')->nullable();
            $table->boolean('sms_updates')->default(false);
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_country_code')->nullable();
            $table->string('emergency_number')->nullable();
            $table->string('email')->nullable(); // Store email from users
            $table->string('country')->nullable();
            $table->string('address')->nullable();
            $table->string('address_details')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('name')->nullable(); // Added to store name from users, optional
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('contacts');
    }
}
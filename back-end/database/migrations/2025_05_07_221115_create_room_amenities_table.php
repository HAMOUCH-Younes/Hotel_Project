<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRoomAmenitiesTable extends Migration
{
    public function up()
    {
        Schema::create('room_amenities', function (Blueprint $table) {
            $table->foreignId('room_id')->constrained()->onDelete('cascade');
            $table->foreignId('amenity_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            $table->primary(['room_id', 'amenity_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('room_amenities');
    }
}
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRoomImagesTable extends Migration
{
    public function up()
    {
        Schema::create('room_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('room_id')->constrained()->onDelete('cascade');  // الربط مع الغرفة
            $table->string('image');  // تخزين اسم الصورة
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('room_images');
    }
}

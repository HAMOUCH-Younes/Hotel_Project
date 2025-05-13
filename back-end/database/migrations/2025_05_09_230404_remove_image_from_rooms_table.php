<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RemoveImageFromRoomsTable extends Migration
{
    public function up()
    {
        Schema::table('rooms', function (Blueprint $table) {
            $table->dropColumn('image');  // Remove the 'image' column
        });
    }

    public function down()
    {
        Schema::table('rooms', function (Blueprint $table) {
            $table->string('image')->nullable();  // Re-add the 'image' column if rolling back the migration
        });
    }
}

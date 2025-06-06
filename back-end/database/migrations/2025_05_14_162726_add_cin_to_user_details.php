<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCinToUserDetails extends Migration
{
    public function up()
    {
        Schema::table('user_details', function (Blueprint $table) {
            $table->string('cin')->nullable()->after('accessibility_needs');
        });
    }

    public function down()
    {
        Schema::table('user_details', function (Blueprint $table) {
            $table->dropColumn('cin');
        });
    }
}
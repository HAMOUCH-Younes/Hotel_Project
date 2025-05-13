<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddContactFieldsToUserDetailsTable extends Migration
{
    public function up()
    {
        Schema::table('user_details', function (Blueprint $table) {
            $table->string('phone_number')->nullable()->after('accessibility_needs');
            $table->string('emergency_contact')->nullable()->after('phone_number');
            $table->text('address')->nullable()->after('emergency_contact');
        });
    }

    public function down()
    {
        Schema::table('user_details', function (Blueprint $table) {
            $table->dropColumn(['phone_number', 'emergency_contact', 'address']);
        });
    }
}
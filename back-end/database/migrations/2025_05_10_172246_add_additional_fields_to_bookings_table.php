<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddAdditionalFieldsToBookingsTable extends Migration
{
    public function up()
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->string('full_name')->after('guests');
            $table->string('email')->nullable()->after('full_name');
            $table->string('payment_method')->after('email');
            $table->text('additional_notes')->nullable()->after('payment_method');
            $table->integer('number_of_nights')->after('additional_notes');
        });
    }

    public function down()
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn(['full_name', 'email', 'payment_method', 'additional_notes', 'number_of_nights']);
        });
    }
}
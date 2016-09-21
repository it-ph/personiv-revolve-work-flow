<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateReworksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('reworks', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('task_id')->unsigned();
            $table->integer('designer_id')->unsigned()->nullable();
            $table->dateTime('designer_time_start')->nullable();
            $table->dateTime('designer_time_end')->nullable();
            $table->integer('designer_minutes_spent')->unsigned()->nullable();
            $table->integer('quality_control_id')->unsigned()->nullable();
            $table->dateTime('quality_control_time_start')->nullable();
            $table->dateTime('quality_control_time_end')->nullable();
            $table->integer('quality_control_minutes_spent')->unsigned()->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('reworks');
    }
}

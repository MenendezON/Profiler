<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('openings', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('code');
            $table->text('description');
            $table->bigInteger('location_id');
            $table->foreign('location_id')->references('id')->on('locations');
            $table->boolean('remote');
            $table->string('experience_required');
            $table->string('employment_type');
            $table->foreign('department_id')->references('id')->on('departments');
            $table->foreign('screeningquestion_id')->references('id')->on('screeningquestions');
            $table->string('industry');
            $table->foreign('user_id')->references('id')->on('users');
            $table->string('status');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('openings');
    }
};

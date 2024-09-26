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
            $table->string('code')->nullable(false);
            $table->text('description');
            $table->foreignId('location_id')->references('id')->on('locations');
            $table->boolean('remote');
            $table->string('experience');
            $table->string('type');
            $table->foreignId('department_id')->references('id')->on('departments');
            $table->foreignId('screeningquestion_id')->references('id')->on('screeningquestions');
            $table->string('industry');
            $table->foreignId('user_id')->references('id')->on('users');
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

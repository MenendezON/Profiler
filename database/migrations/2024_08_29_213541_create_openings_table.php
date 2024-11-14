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
            $table->uuid('id')->primary();
            $table->string('title');
            $table->string('code')->nullable(false);
            $table->text('description');
            $table->foreignUuid('location_id')->references('id')->on('locations');
            $table->boolean('remote');
            $table->string('experience');
            $table->string('type');
            $table->foreignUuid('department_id')->references('id')->on('departments');
            $table->foreignUuid('screeningquestion_id')->references('id')->on('screeningquestions');
            $table->string('industry');
            $table->foreignUuid('user_id')->references('id')->on('users');
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

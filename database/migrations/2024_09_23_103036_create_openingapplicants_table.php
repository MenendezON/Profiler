<?php

use App\Models\Applicant;
use App\Models\Applicants;
use App\Models\Opening;
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
        Schema::create('openingapplicants', function (Blueprint $table) {
            $table->foreignUuid('opening_id')->nullable()->references('id')->on('openings');
            $table->foreignUuid('applicant_id')->references('id')->on('applicants');
            $table->enum('stage', ['new', 'shortlisted', 'interviewed', 'offered', 'hired', 'rejected', 'talentpool']);
            $table->integer('rating')->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('openingapplicants');
    }
};

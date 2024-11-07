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
            $table->foreignIdFor(Opening::class);
            $table->foreignIdFor(Applicant::class);
            $table->enum('state', ['new', 'shortlisted', 'interviewed', 'offered', 'hired', 'rejected']);
            $table->integer('rating')->default(0);
            $table->string('source')->default('Career page');
            $table->primary(['opening_id', 'applicant_id']);
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

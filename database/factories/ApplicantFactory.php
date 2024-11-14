<?php

// database/factories/UserFactory.php
namespace Database\Factories;

use App\Models\Applicant;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ApplicantFactory extends Factory
{
    protected $model = Applicant::class;

    public function definition()
    {
        return [
            'id' => str_replace('-', '', (string) Str::uuid()),
            'first_name' => $this->faker->name,
            'last_name' => $this->faker->name,
            'experience' => '7',
            'city' => 'Ziguinchor',
            'email' => $this->faker->unique()->safeEmail,
            'phone' => '+221776891996',
            'resume' => 'N/A',
            'cover_letter' => 'N/A',
            'skills' => "Bricolage,Rapidité,Adaptabilité",
            'notes' => "Ce petit a de l'avenir",
            'talent_pool' => true
        ];
    }
}

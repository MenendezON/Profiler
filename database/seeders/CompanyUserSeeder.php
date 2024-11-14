<?php

namespace Database\Seeders;

use App\Models\Applicant;
use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CompanyUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $company = Company::create([
            'id' => str_replace('-', '', (string) Str::uuid()),
            'name' => "Mercy Corps",
            'code' => "MCSN",
            'website' => "https://mercycorps.org",
        ]);

        $applicant = Applicant::create([
            'id' => str_replace('-', '', (string) Str::uuid()),
            'first_name' => 'Augustin J.',
            'last_name' => 'NELSON',
            'experience' => '7',
            'city' => 'Ziguinchor',
            'email' => 'nelsonaugustinj@gmail.com',
            'phone' => '+221776891996',
            'resume' => 'N/A',
            'cover_letter' => 'N/A',
            'skills' => "Bricolage,Rapidité,Adaptabilité",
            'notes' => "Ce petit a de l'avenir",
            'talent_pool' => true
        ]);
        Applicant::factory()->count(3)->create();

        $screeningquestions = [
            ['data' => 'Default']
        ];

        $talentPools = [
            ['domain' => 'Human Resources','notes' => 'N/A']
        ];

        $users = [
            ['company_id' => $company->id, 'first_name' => "Super", 'last_name' => "ADMIN", 'email' => "admin@atsprofiler.sn", 'password' => Hash::make('Admin@1234')],
            ['company_id' => $company->id, 'first_name' => "Menendez", 'last_name' => "NELSON", 'email' => "menelson@mercycorps.org", 'password' => Hash::make('ilovemywife')]
        ];

        $locations = [
            ['name' => 'Dakar office', 'address' => 'Ngor-Almadies, Lot 35', 'city' => 'Dakar', 'country' => 'Senegal', 'state' => 'Dakar', 'code_postal' => '15000'],
            ['name' => 'Thies office', 'address' => 'Cité Malick SY, Lot 32', 'city' => 'Thies', 'country' => 'Senegal', 'state' => 'Thies', 'code_postal' => '18000'],
        ];

        $departments = [
            ['name' => 'Human Resources'],
            ['name' => 'Information Technology'],
            ['name' => 'Monitory and Evaluation'],
            ['name' => 'Administration']
        ];

        foreach ($users as $userData) {
            $user = $company->users()->create($userData);
        }

        foreach ($departments as $departmentData) {
            $department = $company->departments()->create($departmentData);
        }

        foreach ($locations as $locationData) {
            $location = $company->locations()->create($locationData);
        }

        foreach ($screeningquestions as $sqData) {
            $company->screeningquestions()->create($sqData);
        }

        foreach ($talentPools as $talentPoolData) {
            $applicant->talentpool()->create($talentPoolData);
        }
    }
}

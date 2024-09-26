<?php

namespace App\Actions\Fortify;

use App\Models\Company;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;
use Laravel\Jetstream\Jetstream;
use Illuminate\Support\Str;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): Company
    {
        Validator::make($input, [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'website' => ['required', 'string', 'max:255'],
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => $this->passwordRules(),
            'terms' => Jetstream::hasTermsAndPrivacyPolicyFeature() ? ['accepted', 'required'] : '',
        ])->validate();

        // Company::create([
        //     'name'=> $input['name'],
        // ]);

        // return User::create([
        //     'name' => "User",
        //     'email' => $input['email'],
        //     'password' => Hash::make($input['password']),
        // ]);


        return DB::transaction(function () use ($input) {
            return tap(Company::create([
                'id' => Str::uuid(),
                'name' => $input['name'],
                'code' => $input['code'],
                'website' => $input['website'],
            ]), function (Company $company) use ($input) {
                return $this->createUser($company, $input);
            });
        });
    }

    protected function createUser(Company $company, $input): void
    {
        $company->users()->save(User::forceCreate([
            'company_id' => $company->id,
            'first_name' => $input['first_name'],
            'last_name' => $input['last_name'],
            'email' => $input['email'],
            'password' => Hash::make($input['password']),
        ]));
    }
}

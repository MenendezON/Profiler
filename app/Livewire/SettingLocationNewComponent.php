<?php

namespace App\Livewire;

use App\Models\Company;
use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\Layout;
use Livewire\Component;

#[Layout('layouts/app')]
class SettingLocationNewComponent extends Component
{
    public Company $company;
    public $name;
    public $address;
    public $city;
    public $state;
    public $country;
    public $country_code;
    public $code_postal;

    public function mount(){
        $this->company = Company::findOrfail(Auth::user()->company->id);
    }

    public function store(){
        $this->company->locations()->create([
            'name' => $this->name, 
            'address' => $this->address, 
            'city' => $this->city,
            'state' => $this->state, 
            'country' => $this->country,  
            'code_postal' => $this->code_postal,
        ]);
        session()->flash('status', 'Post successfully updated.');
 
        return $this->redirect('/settings/locations');
    }


    public function render()
    {
        
        return view('livewire.setting-location-new-component');
    }
}

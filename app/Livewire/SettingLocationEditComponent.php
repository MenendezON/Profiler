<?php

namespace App\Livewire;

use App\Models\Company;
use App\Models\Location;
use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\Layout;
use Livewire\Component;

#[Layout('layouts/app')]
class SettingLocationEditComponent extends Component
{
    public ?Location $location;
    public ?Company $company;

    public $name;
    public $address;
    public $city;
    public $state;
    public $country;
    public $code_postal;

    public function mount($id)
    {
        $this->location = Location::findOrFail($id);
        $this->company = Company::findOrfail(Auth::user()->company->id);

        $this->name = $this->location->name;
        $this->address = $this->location->address;
        $this->city = $this->location->city;
        $this->state = $this->location->state;
        $this->country = $this->location->country;
        $this->code_postal = $this->location->code_postal;
    }

    public function update()
    {
        $this->company->locations()->where('id', $this->location->id)->update([
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
        //dd($this->location);
        return view('livewire.setting-location-edit-component');
    }
}

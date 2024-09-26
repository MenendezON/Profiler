<?php

namespace App\Livewire;

use App\Models\Location;
use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\Layout;
use Livewire\Component;

#[Layout('layouts/app')]
class SettingLocationComponent extends Component
{

    public function render()
    {
        $locations = Location::where('company_id', Auth::user()->company->id)->get();
        
        return view('livewire.setting-location-component', [
            'locations' => $locations,
        ]);
    }
}
 
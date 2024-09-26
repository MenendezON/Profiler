<?php

namespace App\Livewire;

use App\Models\Department;
use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\Layout;
use Livewire\Component;

#[Layout('layouts/app')]
class SettingDepartementComponent extends Component
{
    public function render()
    {
        $departments = Department::where('company_id', Auth::user()->company->id)->get();
        return view('livewire.setting-departement-component', [
            'departments' => $departments,
        ]);
    }
}

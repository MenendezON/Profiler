<?php

namespace App\Livewire;

use App\Models\Company;
use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\Layout;
use Livewire\Component;

#[Layout('layouts/app')]
class SettingDepartementNewComponent extends Component
{
    public ?Company $company;
    public $name;

    public function mount(){
        $this->company = Company::findOrfail(Auth::user()->company->id);
    }

    public function store(){
        $this->company->departments()->create([
            'name' => $this->name, 
        ]);
        session()->flash('status', 'Department successfully updated.');
 
        return $this->redirect('/settings/departments');
    }
    public function render()
    {
        return view('livewire.setting-departement-new-component');
    }
}

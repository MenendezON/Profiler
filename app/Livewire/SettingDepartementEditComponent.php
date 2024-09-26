<?php

namespace App\Livewire;

use App\Models\Company;
use App\Models\Department;
use App\Models\Location;
use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\Layout;
use Livewire\Component;

#[Layout('layouts/app')]
class SettingDepartementEditComponent extends Component
{
    public ?Department $department;
    public ?Company $company;

    public $name;

    public function mount($id)
    {
        $this->department = Department::findOrFail($id);
        $this->company = Company::findOrfail(Auth::user()->company->id);

        $this->name = $this->department->name;
    }

    public function update()
    {
        $this->company->departments()->where('id', $this->department->id)->update([
            'name' => $this->name,
        ]);

        session()->flash('status', 'Department successfully updated.');

        return $this->redirect('/settings/departments');
    }
    public function render()
    {
        return view('livewire.setting-departement-edit-component');
    }
}

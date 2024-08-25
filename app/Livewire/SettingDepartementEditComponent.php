<?php

namespace App\Livewire;

use Livewire\Attributes\Layout;
use Livewire\Component;

#[Layout('layouts/app')]
class SettingDepartementEditComponent extends Component
{
    public function render()
    {
        return view('livewire.setting-departement-edit-component');
    }
}

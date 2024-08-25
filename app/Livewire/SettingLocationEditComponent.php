<?php

namespace App\Livewire;

use Livewire\Attributes\Layout;
use Livewire\Component;

#[Layout('layouts/app')]
class SettingLocationEditComponent extends Component
{
    public function render()
    {
        return view('livewire.setting-location-edit-component');
    }
}

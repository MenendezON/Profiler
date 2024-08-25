<?php

namespace App\Livewire;

use Livewire\Attributes\Layout;
use Livewire\Component;

#[Layout('layouts/app')]
class SettingDepartementNewComponent extends Component
{
    public function render()
    {
        return view('livewire.setting-departement-new-component');
    }
}

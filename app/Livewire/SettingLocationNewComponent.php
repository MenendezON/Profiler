<?php

namespace App\Livewire;

use Livewire\Attributes\Layout;
use Livewire\Component;

#[Layout('layouts/app')]
class SettingLocationNewComponent extends Component
{
    public function render()
    {
        return view('livewire.setting-location-new-component');
    }
}

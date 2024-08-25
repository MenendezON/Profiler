<?php

namespace App\Livewire;

use Livewire\Attributes\Layout;
use Livewire\Component;

#[Layout('layouts/app')]
class SettingEmailTemplateComponent extends Component
{
    public function render()
    {
        return view('livewire.setting-email-template-component');
    }
}

<?php

namespace App\Livewire;

use Livewire\Attributes\Layout;
use Livewire\Component;

#[Layout('layouts/app')]
class SettingScreenQuestionsComponent extends Component
{
    public function render()
    {
        return view('livewire.setting-screen-questions-component');
    }
}

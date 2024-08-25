<?php

namespace App\Livewire;

use Livewire\Attributes\Layout;
use Livewire\Attributes\Title;
use Livewire\Component;

#[Layout('layouts.app')]
class SettingScreenQuestionsDetailsComponent extends Component
{
    #[Title('Form Template Details')]
    public function render()
    {
        return view('livewire.setting-screen-questions-details-component');
    }
}

<?php

namespace App\Livewire;

use Livewire\Attributes\Layout;
use Livewire\Attributes\Title;
use Livewire\Component;

#[Layout('layouts/app')]
class InterviewsComponent extends Component
{
    #[Title('Interviews')]
    public function render()
    {
        return view('livewire.interviews-component');
    }
}

<?php

namespace App\Livewire;

use Livewire\Attributes\Layout;
use Livewire\Attributes\Title;
use Livewire\Component;

#[Layout('layouts/app')]
class Applications extends Component
{
    #[Title('Applications')]
    public function render()
    {
        return view('livewire.applications');
    }
}

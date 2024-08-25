<?php

namespace App\Livewire;

use Livewire\Attributes\Layout;
use Livewire\Component;

#[Layout('layouts.app')]
class OpeningEditComponent extends Component
{
    public function render()
    {
        return view('livewire.opening-edit-component');
    }
}

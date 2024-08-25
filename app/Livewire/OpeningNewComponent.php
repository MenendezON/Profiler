<?php

namespace App\Livewire;

use Livewire\Attributes\Layout;
use Livewire\Attributes\Title;
use Livewire\Component;

#[Layout('layouts/app')]
class OpeningNewComponent extends Component
{
    #[Title('Add New Opening')]
    public function render()
    {
        return view('livewire.opening-new-component');
    }
}

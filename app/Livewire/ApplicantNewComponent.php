<?php

namespace App\Livewire;

use Livewire\Attributes\Layout;
use Livewire\Component;

#[Layout('layouts/app')]
class ApplicantNewComponent extends Component
{
    public function render()
    {
        return view('livewire.applicant-new-component');
    }
}

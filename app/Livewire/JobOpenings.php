<?php

namespace App\Livewire;

use Livewire\Attributes\Layout;
use Livewire\Attributes\Title;
use Livewire\Component;

#[Layout('layouts/app')]
class JobOpenings extends Component
{
    #[Title('Job Openings')] 
    public function render()
    {
        return view('livewire.job-openings');
    }
}

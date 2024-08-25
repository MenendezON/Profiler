<?php

namespace App\Livewire;

use Livewire\Attributes\Layout;
use Livewire\Component;

#[Layout('layouts/app')]
class OpeningDetailsComponent extends Component
{
    
    public function updateState(String $string){

    }

    public function render()
    {
        return view('livewire.opening-details-component', [
            
        ]);
    }

}

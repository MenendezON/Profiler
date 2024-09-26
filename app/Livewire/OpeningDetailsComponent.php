<?php

namespace App\Livewire;

use App\Models\Opening;
use Livewire\Attributes\Layout;
use Livewire\Component;

#[Layout('layouts/app')]
class OpeningDetailsComponent extends Component
{
    public $opening;
    
    public function mount($id)
    {
        $this->opening = Opening::findOrFail($id);
    }

    public function updateState(String $string){

    }

    public function render()
    {
        return view('livewire.opening-details-component', [
            
        ]);
    }

}

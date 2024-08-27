<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\Layout;
use Livewire\Component;

#[Layout('layouts.app')]
class DashboardComponent extends Component
{
    public function render()
    {
       return view('livewire.dashboard-component');
    }
}

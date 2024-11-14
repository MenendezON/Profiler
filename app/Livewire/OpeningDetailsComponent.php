<?php

namespace App\Livewire;

use App\Models\Opening;
use Livewire\Attributes\Layout;
use Illuminate\Support\Facades\DB;
use Livewire\Component;

#[Layout('layouts/app')]
class OpeningDetailsComponent extends Component
{
    public $opening;
    public $applicantStatusCounts;

    public function mount($id)
    {
        $this->opening = Opening::findOrFail($id);

        $this->applicantStatusCounts = DB::table('openingapplicants')
    ->select('opening_id', 'stage', DB::raw('COUNT(*) as total_records'))
    ->groupBy('opening_id', 'stage')
    ->get();
    }

    public function updateState(String $string){

    }

    public function render()
    {
        return view('livewire.opening-details-component', [
            
        ]);
    }

}

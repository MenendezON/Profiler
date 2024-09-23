<?php

namespace App\Livewire;

use App\Models\Opening;
use Illuminate\Support\Facades\DB;
use Livewire\Attributes\Layout;
use Livewire\Attributes\Title;
use Livewire\Component;

#[Layout('layouts/app')]
class JobOpenings extends Component
{
    public $openings;
    public $jobStatusCounts;
    public $activeLink;

    public function mount($categ)
    {
        $this->activeLink = $categ;
        
        $this->jobStatusCounts = DB::table('openings')
                        ->select('status', DB::raw('COUNT(*) as total_records'))
                        ->groupBy('status')
                        ->get();

        $this->openings = ($categ === "all") ? Opening::orderBy('created_at', 'desc')->get() : Opening::where('status', $categ)->orderBy('created_at', 'desc')->get();

    }

    #[Title('Job Openings')] 
    public function render()
    {
        return view('livewire.job-openings');
    }
}

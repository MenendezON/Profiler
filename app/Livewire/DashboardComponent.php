<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Livewire\Attributes\Layout;
use Livewire\Component;

#[Layout('layouts.app')]
class DashboardComponent extends Component
{

    public $jobStatusCounts;
    public $applicationStatusCounts;

    public function mount()
    {
        $this->jobStatusCounts = DB::table('openings')
                        ->select('status', DB::raw('COUNT(*) as total_records'))
                        ->groupBy('status')
                        ->get();
        
        $this->applicationStatusCounts = DB::table('OpeningApplicants as oa')
        ->join('Applicants as a', 'oa.applicant_id', '=', 'a.id')
        ->join('Openings as o', 'oa.opening_id', '=', 'o.id')
        ->select('oa.state', DB::raw('COUNT(*) as total_records'))
        ->groupBy('oa.state')
        ->get();

        //dd($this->applicationStatusCounts);
    }

    public function render()
    {
       return view('livewire.dashboard-component');
    }
}

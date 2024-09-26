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
        ->select(
            'a.id as idap', 
            'o.id as idop', 
            'a.first_name', 
            'a.last_name', 
            'oa.stage', 
            'oa.rating', 
            'oa.source', 
            'oa.created_at', 
            'o.title', 
            'o.code', 
            'o.status'
        )
        ->get();

        dd($this->applicationStatusCounts);
    }

    public function render()
    {
       return view('livewire.dashboard-component');
    }
}

<?php

namespace App\Livewire;

use App\Models\TalentPool;
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

        $this->applicationStatusCounts = DB::table('Applicants as a')
            ->leftJoin('OpeningApplicants as oa', 'a.id', '=', 'oa.applicant_id') // Left join to include applicants without an opening
            ->leftJoin('Openings as o', 'oa.opening_id', '=', 'o.id') // Left join to include null openings if oa.opening_id is null
            ->select('oa.stage', DB::raw('COUNT(*) as total_records'))
            ->groupBy('oa.stage')
            ->get();
    }

    public function render()
    {
        return view('livewire.dashboard-component');
    }
}

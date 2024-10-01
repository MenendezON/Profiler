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
    public $applicantStatusCounts;
    public $activeLink;

    public function mount($categ)
    {
        // get the active link, it could be publish, unpublish or internal
        $this->activeLink = $categ;

        // get the number of openings by category
        $this->jobStatusCounts = DB::table('openings')
            ->select('status', DB::raw('COUNT(*) as total_records'))
            ->groupBy('status')
            ->get();

        // display the openings by category, such as: published, internal or unpublished
        $this->openings = ($categ === "all") ? Opening::orderBy('created_at', 'desc')->get() : Opening::where('status', $categ)->orderBy('created_at', 'desc')->get();

        $this->applicantStatusCounts = DB::table('openingapplicants')
    ->select('opening_id', 'stage', DB::raw('COUNT(*) as total_records'))
    ->groupBy('opening_id', 'stage')
    ->get();

        //dd($this->applicantStatusCounts);
    }

    #[Title('Job Openings')]
    public function render()
    {
        return view('livewire.job-openings');
    }
}

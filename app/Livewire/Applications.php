<?php

namespace App\Livewire;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Livewire\Attributes\Layout;
use Livewire\Attributes\Title;
use Livewire\Component;

#[Layout('layouts/app')]
class Applications extends Component
{
    public $pipelines = [];
    public $jbs = [];
    public $sources = ['career page', 'dashboard'];
    public $search_name;
    public $state;
    public $opening_id;
    public $rating;
    public $tags;
    public $experience;
    public $listOfApplicants;
    public $showNum;
    public function mount(Request $request)
    {
        $pipeline = $request->query('pipeline', []);
        $this->showNum = $request->query('showNum');
        $this->search_name = $request->query('search_name');
        $this->state = $request->query('state');
        $this->opening_id = $request->query('opening_id');
        $this->rating = $request->query('rating');
        $this->experience = $request->query('experience');
        $this->tags = $request->query('tags');

        $jb = $request->query('jb', []);

        foreach ($pipeline as $item) {
            $this->pipelines[] = $item;
        }

        foreach ($jb as $item) {
            $this->jbs[] = $item;
        }

        $this->listOfApplicants = DB::table('Applicants as a')
            ->leftJoin('OpeningApplicants as oa', 'a.id', '=', 'oa.applicant_id') // Left join to include applicants without an opening
            ->leftJoin('Openings as o', 'oa.opening_id', '=', 'o.id') // Left join to include null openings if oa.opening_id is null
            ->select(
                'a.id as idap',
                'o.id as idop',
                'a.first_name',
                'a.last_name',
                'oa.stage',
                'oa.rating',
                'oa.created_at',
                'o.title',
                'a.source',
                'o.code',
                'o.status'
            )
            ->where(function ($query) {
                if ($this->opening_id !== null && $this->opening_id !== 'all') {
                    $query->where('o.id', $this->opening_id);
                }
            })
            ->whereIn('oa.stage', $this->pipelines)
            ->where(function ($query) {
                $query->orWhere('a.first_name', 'like', '%' . $this->search_name . '%')
                    ->orWhere('a.last_name', 'like', '%' . $this->search_name . '%')
                    ->orWhere('o.title', 'like', '%' . $this->search_name . '%');
            })
            ->limit($this->showNum)
            ->get();
    }

    #[Title('Applications')]
    public function render()
    {
        return view('livewire.applications');
    }
}

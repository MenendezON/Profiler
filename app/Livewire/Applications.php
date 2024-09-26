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
    public $sources = ['career page','dashboard'];
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
       
        foreach($pipeline as $item){
            $this->pipelines[] = $item;
        }

        foreach($jb as $item){
            $this->jbs[] = $item;
        }

//dd($this->opening_id);
$this->listOfApplicants = DB::table('OpeningApplicants as oa')
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
->where('o.id', $this->opening_id)
->whereIn('oa.stage', $this->pipelines)
->where(function ($query) {
    $query->orWhere('a.first_name', 'like', '%' . $this->search_name . '%')
          ->orWhere('a.last_name', 'like', '%' . $this->search_name . '%')
          ->orWhere('o.title', 'like', '%' . $this->search_name . '%');
})
->limit($this->showNum)
->get();


      
        //dd($this->listOfApplicants);
        //dd(explode(",",$this->tags));
    }

    #[Title('Applications')]
    public function render()
    {
        return view('livewire.applications');
    }
}

<?php

namespace App\Livewire;

use App\Models\Company;
use App\Models\Opening;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\Layout;
use Livewire\Attributes\Title;
use Livewire\Component;

#[Layout('layouts/app')]
class OpeningNewComponent extends Component
{
    public $title;
    public $code;
    public $description;// = "Job Brief:<br><br><br>Responsibilities:<br><br><br>Skills Required:";
    public $location_id;
    public $remote = false;
    public $experience;
    public $type;
    public $department_id;
    public $template_id;
    public $industry;
    public $status = "published";

    public function mount(Request $request)
    {
        $currentUserCompany = Auth::user()->company->code;
        $openingNbr = Opening::all()->count() + 1;
        
        if(strlen($openingNbr)<2)
            $openingNbr = "-00$openingNbr";
        elseif(strlen($openingNbr)<3)
            $openingNbr = "-0$openingNbr";
        else
            $openingNbr = "-$openingNbr";

        $this->code = "$currentUserCompany$openingNbr";
    }

    public function store(Request $request)
    {
        $opening = new Opening();
        $opening->title = $this->title;
        $opening->code = $this->code;
        $opening->description = htmlentities($this->description);
        $opening->location_id = $this->location_id;
        $opening->remote = $this->remote;
        $opening->experience = $this->experience;
        $opening->type = $this->type;
        $opening->department_id = $this->department_id;
        $opening->screeningquestion_id = $this->template_id;
        $opening->industry = $this->industry;
        $opening->user_id = Auth::user()->id;
        $opening->status = $this->status;

        $opening->save();

        session()->flash('message', 'Opening successfully created.');
 
        //return $this->redirect('/openings/published');
        return redirect()->route('opening.show', $opening->id);        
    }


    #[Title('Add New Opening')]
    public function render()
    {
        return view('livewire.opening-new-component');
    }
}

<?php

namespace App\Livewire;

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
    public $description = "Job Brief:<br><br><br>Responsibilities:<br><br><br>Skills Required:";
    public $location_id;
    public $remote = false;
    public $experience;
    public $employment_type;
    public $department_id;
    public $template_id;
    public $industry;
    public $status = "";

    public function mount(Request $request)
    {

        // $action = $request->input('finish');
        // if ($action === "Finish") {
        //     //dd($request->input('job_description'));
        //     $this->title = $request->input('job_title');
        //     $this->code = $request->input('job_code');
        //     $this->description = $request->input('job_description');
        //     $this->location_id = $request->input('job_location_id');
        //     $this->remote = $request->input('job_remote');
        //     $this->experience = $request->input('job_experience');
        //     $this->employment_type = $request->input('job_employment_type');
        //     $this->department_id = $request->input('company_department');
        //     $this->template_id = $request->input('ft_id');
        //     $this->industry = $request->input('job_industry');
        // }
    }

    public function store(Request $request)
    {
        dd($request);
        // $action = $request->input('finish');
        // if ($action === "Finish") {
        //     //dd($request->input('job_description'));
        //     $this->title = $request->input('job_title');
        //     $this->code = $request->input('job_code');
        //     $this->description = $request->input('job_description');
        //     $this->location_id = $request->input('job_location_id');
        //     $this->remote = $request->input('job_remote');
        //     $this->experience = $request->input('job_experience');
        //     $this->employment_type = $request->input('job_employment_type');
        //     $this->department_id = $request->input('company_department');
        //     $this->template_id = $request->input('ft_id');
        //     $this->industry = $request->input('job_industry');

        //     $opening = Opening::create([
        //         'title' => $this->title,
        //         'code' => $this->code,
        //         'description' => $this->description,
        //         'location_id' => $this->location_id,
        //         'remote' => $this->remote,
        //         'experience_required' => $this->experience,
        //         'employment_type' => $this->employment_type,
        //         'department_id' => $this->department_id,
        //         'screeningquestion_id' => $this->template_id,
        //         'industry' => $this->industry,
        //         'user_id' => Auth::user()->id,
        //         'status' => $this->status,
        //     ]);


        // }
        //dd('Description : '.htmlentities($this->description));
        //dd($this->description);
    }


    #[Title('Add New Opening')]
    public function render()
    {
        return view('livewire.opening-new-component');
    }
}

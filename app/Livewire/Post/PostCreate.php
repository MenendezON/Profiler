<?php

namespace App\Livewire\Post;

use App\Livewire\Forms\PostForm;
use App\Models\Category;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\Layout;
use Livewire\Attributes\Rule;
use Livewire\Component;
use Illuminate\Support\Str;

#[Layout('layouts/app')]
class PostCreate extends Component
{
    public PostForm $postForm;

    #[Rule('required')]
    public $title;
    #[Rule('required')]
    public $location;
    #[Rule('required')]
    public $deadline;
    #[Rule('required')]
    public $type;
    #[Rule('required')]
    public $contract_length = 0;
    #[Rule('required')]
    public $description;
    #[Rule('required')]
    public $status;
    #[Rule('required')]
    public $year_experience;
    #[Rule('required')]
    public $category;

    public $categ = [];

    public function boot()
    {
        $categories = Category::all();
        
        foreach($categories as $category)
        {
            if(Auth::user()->company->id === User::find($category->user_id)->company_id)
            {
                $this->categ[] = $category;
            }
        }
    }

    public function getSlugProperty()
    {
        return Str::of($this->title)->slug('-');
    }

    public function store()
    {
        $this->validate();

        // Assuming the user is authenticated
        $user = Auth::user();

        $user->posts()->create([
            'title' => $this->title,
            'location' => $this->location,
            'deadline' => $this->deadline,
            'type' => $this->type,
            'contract_length' => $this->contract_length,
            'description' => $this->description,
            'status' => $this->status,
            'year_experience' => $this->year_experience,
            'category_id' => $this->category,
            'slug' => $this->getSlugProperty(),
        ]);

        $this->reset();
        session()->flash('success', 'La classe a été créée!');

        return redirect()->to('/jobs');
    }

    public function render()
    {
        return view('livewire.post.post-create',[
            'categories' => $this->categ,
        ]);
    }
}

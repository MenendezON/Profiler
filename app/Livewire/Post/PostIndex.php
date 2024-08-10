<?php

namespace App\Livewire\Post;

use App\Livewire\Forms\PostForm;
use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\Layout;
use Livewire\Attributes\Rule;
use Livewire\Component;
use Illuminate\Support\Str;

#[Layout('layouts/app')]
class PostIndex extends Component
{
    public PostForm $postForm;

    #[Rule('required|min:10')]
    public $title;
    #[Rule('required')]
    public $location;
    #[Rule('required')]
    public $deadline;
    #[Rule('required')]
    public $type;
    #[Rule('required')]
    public $contract_length = 0;
    #[Rule('required|min:50')]
    public $description;
    #[Rule('required|min:50')]
    public $prerequis;
    #[Rule('required')]
    public $status;
    #[Rule('required')]
    public $experience_level;
    #[Rule('required')]
    public $category;

    public $createPostModal = false;


    public function showCreatePostModal()
    {
        $this->createPostModal = true;
    }

    public function mount()
    {
        //$categories = Category::all();

        //$posts = Post::all();

        // foreach ($posts as $post) {
        //     if (Auth::user()->company->id === User::find($post->user_id)->company_id) {
        //         $this->posts[] = $post;
        //     }
        // }

        // foreach ($categories as $category) {
        //     if (Auth::user()->company->id === User::find($category->user_id)->company_id) {
        //         $this->categ[] = $category;
        //     }
        // }
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
            'slug' => $this->getSlugProperty(),
            'category_id' => $this->category,
            'location' => $this->location,
            'deadline' => $this->deadline,
            'type' => $this->type,
            'contract_length' => $this->contract_length,
            'description' => $this->description,
            'prerequis' => $this->prerequis,
            'status' => $this->status,
            'experience_level' => $this->experience_level,
        ]);

        $this->reset();
        session()->flash('success', "L'offre d'emploi a été créée !");
    }

    public function render()
    {
        $companyId = Auth::user()->company->id;

        $categories = Category::whereHas('user', function ($query) use ($companyId) {
            $query->where('company_id', $companyId);
        })->get();


        $posts = Post::whereHas('user', function ($query) use ($companyId) {
            $query->where('company_id', $companyId);
        })->orderBy('created_at', 'desc')->paginate(10);


        return view('livewire.post.post-index', [
            'categories' => $categories,
            'posts' => $posts,
        ]);
    }
}

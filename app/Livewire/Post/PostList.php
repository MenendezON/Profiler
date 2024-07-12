<?php

namespace App\Livewire\Post;

use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Livewire\Component;

class PostList extends Component
{
    public $categ = [];

    public function boot()
    {
        $posts = Post::all();
        
        foreach($posts as $post)
        {
            if(Auth::user()->company->id === User::find($post->user_id)->company_id)
            {
                $this->categ[] = $post;
            }
        }
    }

    public function render()
    {
        //dd(Post::all());
        return view('livewire.post.post-list',[
            'posts' => $this->categ,
        ]);
    }
}

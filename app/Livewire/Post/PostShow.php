<?php

namespace App\Livewire\Post;

use App\Models\Post;
use Livewire\Attributes\Layout;
use Livewire\Component;

#[Layout('layouts/app')]
class PostShow extends Component
{
    public $post;
    public function mount($slug)
    {
        $this->post = Post::where('slug', $slug)->firstOrFail();
    }
    public function render()
    {
        return view('livewire.post.post-show', [
            'post' => $this->post,
        ]);
    }
}

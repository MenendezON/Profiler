<?php

namespace App\Livewire\Post;

use Livewire\Attributes\Layout;
use Livewire\Component;

#[Layout('layouts/app')]
class PostIndex extends Component
{
    public function render()
    {
        return view('livewire.post.post-index');
    }
}

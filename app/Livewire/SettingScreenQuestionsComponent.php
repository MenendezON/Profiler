<?php

namespace App\Livewire;

use App\Models\Screeningquestion;
use Livewire\Attributes\Layout;
use Livewire\Component;

#[Layout('layouts/app')]
class SettingScreenQuestionsComponent extends Component
{
    public $title;
    public $createPostModal = false;

    protected $rules = [
        'title' => 'required|string|max:255',
    ];

    public function addFormTemplate()
    {
        $this->validate();     
    }

    public function showCreatePostModal()
    {
        $this->createPostModal = true;
    }

    public function render()
    {
        return view('livewire.setting-screen-questions-component');
    }
}

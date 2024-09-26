<?php

namespace App\Livewire;

use App\Models\Question;
use App\Models\Screeningquestion;
use Livewire\Attributes\Layout;
use Livewire\Attributes\Title;
use Livewire\Component;

#[Layout('layouts.app')]
class SettingScreenQuestionsDetailsComponent extends Component
{

    public $screeningquestion;
    public $question;

    public function mount($id)
    {
        $this->screeningquestion = Screeningquestion::findOrFail($id);
        $this->question = Question::all();
    }

    #[Title('Form Template Details')]
    public function render()
    {
        return view('livewire.setting-screen-questions-details-component');
    }
}

<?php

namespace App\Livewire\Category;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;
use Illuminate\Support\Str;
use Livewire\Attributes\Rule;
use Livewire\Attributes\Validate;

class CategoryCreate extends Component
{

    public $name;

    protected $rules = [
        'name' => 'required|string|max:255',
    ];

    public function store()
    {
        $this->validate();

        // Assuming the user is authenticated
        $user = Auth::user();

        $user->categories()->create([
            'name' => $this->name,
            'slug' => $this->getSlugProperty(),
        ]);

        $this->reset();
        session()->flash('success', 'La classe a été créée!');
    }

    public function getSlugProperty()
    {
        return Str::of($this->name)->slug('-');
    }

    public function render()
    {
        return view('livewire.category.category-create', [
            'getSlugProperty' => $this->getSlugProperty(),
        ]);
    }
}

<?php

namespace App\Livewire\Forms;

use Livewire\Attributes\Validate;
use Livewire\Form;

class CategoryForm extends Form
{
    public $name;

    protected $rules = [
        'name' => 'required|string|max:255',
    ];
}

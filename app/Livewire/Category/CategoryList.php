<?php

namespace App\Livewire\Category;

use App\Models\Category;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Livewire\Component;
use Livewire\WithPagination;

class CategoryList extends Component
{
    use WithPagination;

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

    public function render()
    {

        return view('livewire.category.category-list', [
            'categories' => $this->categ,
        ]);
    }
}

<?php

namespace App\Livewire\Category;

use App\Models\Category;
use App\Models\Company;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\Layout;
use Livewire\Component;
use Illuminate\Support\Str;
use Livewire\WithPagination;

#[Layout('layouts/app')]
class CategoryIndex extends Component
{
    use WithPagination;
    public $name;

    protected $rules = [
        'name' => 'required|string|max:255',
    ];
    //public $categ = [];
    public $showCategoryModal = false;


    public function getSlugProperty()
    {
        return Str::of($this->name)->slug('-');
    }

    public function showCreateCategoryModal()
    {
        $this->showCategoryModal = true;
    }

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
        session()->flash('success', 'La catégorie a été créée!');
    }

    public function render()
    {
        $companyId = Auth::user()->company->id;
        
        $categories = Category::whereHas('user', function ($query) use ($companyId) {
            $query->where('company_id', $companyId);
        })->paginate(8);

        return view('livewire.category.category-index', [       
            'categories' => $categories,
            'getSlugProperty' => $this->getSlugProperty(),
        ]);
    }
}

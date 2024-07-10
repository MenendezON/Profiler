<?php

namespace App\Livewire\Company;

use App\Models\Company;
use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\Layout;
use Livewire\Component;

class IndexCompany extends Component
{
    #[Layout('layouts.app')]
    public function render()
    {
        $companies = Company::where('name', Auth::user()->company->name)->get();
        return view('livewire.company.index-company', [
            'companies' => $companies,
        ]);
    }
}

<?php

use App\Livewire\Category\CategoryIndex;
use App\Livewire\Category\CategoryList;
use App\Livewire\Company\IndexCompany;
use App\Livewire\Post\PostIndex;
use App\Livewire\Post\PostList;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
])->group(function () {
    Route::get('/dashboard', function () {
        return view('dashboard');
    })->name('dashboard');

    Route::get('/company', IndexCompany::class)->name('index-company');
    
    Route::get('/categories', CategoryIndex::class)->name('category-index');

    Route::get('/jobs', PostIndex::class)->name('post-index');
});

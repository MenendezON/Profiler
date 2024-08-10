<?php

use App\Livewire\Category\CategoryIndex;
use App\Livewire\Category\CategoryList;
use App\Livewire\Company\IndexCompany;
use App\Livewire\HomePage;
use App\Livewire\Post\PostCreate;
use App\Livewire\Post\PostIndex;
use App\Livewire\Post\PostList;
use App\Livewire\Post\PostShow;
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

    Route::get('/dashboard/overview', HomePage::class)->name('home');

    Route::get('/company', IndexCompany::class)->name('company-index');
    
    Route::get('/categories', CategoryIndex::class)->name('category-index');

    Route::get('/offers', PostIndex::class)->name('post-index');
    Route::get('/offers/{slug}/pipeline', PostShow::class)->name('post-show');
    //Route::get('/offers/o/{slug}', PostShow::class)->name('post-show');
});

<?php

use App\Http\Controllers\ApplicantController;
use App\Http\Controllers\ScreeningController;
use App\Livewire\ApplicantNewComponent;
use App\Livewire\Applications;
use App\Livewire\Category\CategoryIndex;
use App\Livewire\Category\CategoryList;
use App\Livewire\Company\IndexCompany;
use App\Livewire\DashboardComponent;
use App\Livewire\HomePage;
use App\Livewire\InterviewsComponent;
use App\Livewire\JobOpenings;
use App\Livewire\OpeningDetailsComponent;
use App\Livewire\OpeningEditComponent;
use App\Livewire\OpeningNewComponent;
use App\Livewire\Post\PostCreate;
use App\Livewire\Post\PostIndex;
use App\Livewire\Post\PostList;
use App\Livewire\Post\PostShow;
use App\Livewire\ReportsComponent;
use App\Livewire\SettingActivityLogsComponent;
use App\Livewire\SettingDepartementComponent;
use App\Livewire\SettingDepartementEditComponent;
use App\Livewire\SettingDepartementNewComponent;
use App\Livewire\SettingEmailTemplateComponent;
use App\Livewire\SettingLocationComponent;
use App\Livewire\SettingLocationEditComponent;
use App\Livewire\SettingLocationNewComponent;
use App\Livewire\SettingsComponent;
use App\Livewire\SettingScreenQuestionsComponent;
use App\Livewire\SettingScreenQuestionsDetailsComponent;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
])->group(function () {
    Route::get('/api/listtemplate', [ScreeningController::class, 'list']);
    Route::POST('/api/createtemplate', [ScreeningController::class, 'store']);
    Route::POST('/api/listlocation', [ScreeningController::class, 'listlocation']);
    Route::POST('/api/listdepartment', [ScreeningController::class, 'listdepartment']);
    Route::POST('/api/listtemplate', [ScreeningController::class, 'listtemplate']);

    Route::GET('/api/viewapplicant', [ApplicantController::class, 'view']);

    Route::get('/dashboard', DashboardComponent::class)->name('dashboard');

    Route::get('/openings/new', OpeningNewComponent::class)->name('opening.new');
    Route::get('/openings/{categ}', JobOpenings::class)->name('openings');
    Route::get('/openings/details/{id}', OpeningDetailsComponent::class)->name('opening.show');
    Route::get('/openings/details/{id}/edit', OpeningEditComponent::class)->name('opening.edit');

    Route::get('/applications', Applications::class)->name('applications');
    Route::get('/applications/add-candidate', ApplicantNewComponent::class)->name('applicant.new');

    Route::get('/interviews', InterviewsComponent::class)->name('interviews');
    Route::get('/reports/home', ReportsComponent::class)->name('reports');

    Route::get('/settings', SettingsComponent::class)->name('settings');
    Route::get('/settings/locations', SettingLocationComponent::class)->name('settings.locations');
    Route::get('/settings/locations/new', SettingLocationNewComponent::class)->name('settings.locations.new');
    Route::get('/settings/locations/{id}/edit', SettingLocationEditComponent::class)->name('settings.locations.edit');
    Route::get('/settings/departments', SettingDepartementComponent::class)->name('settings.departments');
    Route::get('/settings/departments/new', SettingDepartementNewComponent::class)->name('settings.departments.new');
    Route::get('/settings/departments/{id}/edit', SettingDepartementEditComponent::class)->name('settings.departments.edit');

    Route::get('/settings/form-templates', SettingScreenQuestionsComponent::class)->name('settings.screenquestion');
    Route::get('/settings/form-templates/details/{id}', SettingScreenQuestionsDetailsComponent::class)->name('settings.screenquestion.show');

    Route::get('/settings/email-templates', SettingEmailTemplateComponent::class)->name('settings.emailtemplate');
    Route::get('/settings/activity-log', SettingActivityLogsComponent::class)->name('settings.activitylog');
});

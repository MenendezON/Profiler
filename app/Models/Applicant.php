<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Applicant extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'experience',
        'city',
        'email',
        'phone',
        'resume',
        'cover_letter',
        'skills',
        'notes',
        'talent_pool'
    ];


    public function openings(): BelongsToMany
    {
        return $this->belongsToMany(Opening::class, 'openingapplicants')->withPivot('stage', 'rating', 'source')->withTimestamps();
    }

    public function TalentPool():HasOne
    {
        return $this->hasOne(TalentPool::class);
    }
}

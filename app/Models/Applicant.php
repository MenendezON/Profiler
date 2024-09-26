<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

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
        'letter'
    ];


    public function openings(): BelongsToMany
    {
        return $this->belongsToMany(Opening::class, 'openingapplicants')->withPivot('stage', 'rating', 'source')->withTimestamps();
    }
}

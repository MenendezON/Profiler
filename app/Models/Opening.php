<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Opening extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'code',
        'description',
        'remote',
        'experience_required',
        'employment_type',
        'industry',
        'status',
        'location_id',
        'department_id',
        'screeningquestion_id',
        'user_id'
    ];

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function applicants(): BelongsToMany
    {
        return $this->belongsToMany(Applicants::class, 'openingapplicants')->withPivot('stage', 'rating', 'source')->withTimestamps();
    }

}

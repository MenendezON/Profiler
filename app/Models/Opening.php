<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

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

    protected $keyType = 'string';
    public $incrementing = false;

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = str_replace('-', '', (string) Str::uuid());
            }
        });
    }

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
        return $this->belongsToMany(Applicant::class, 'openingapplicants')->withPivot('stage', 'rating', 'source')->withTimestamps();
    }

}

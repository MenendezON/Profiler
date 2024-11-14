<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str;

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
        'talent_pool',
        'source'
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

    public function openings(): BelongsToMany
    {
        return $this->belongsToMany(Opening::class, 'openingapplicants')->withPivot('stage', 'rating', 'source')->withTimestamps();
    }

    public function talentpool():HasOne
    {
        return $this->hasOne(TalentPool::class);
    }
}

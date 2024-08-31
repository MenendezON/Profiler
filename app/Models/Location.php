<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Location extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'address',
        'city',
        'country',
        'state',
        'code_postal'
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function openings()
    {
        return $this->hasMany(Opening::class);
    }
}

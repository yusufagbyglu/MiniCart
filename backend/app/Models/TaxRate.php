<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaxRate extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'country',
        'state',
        'city',
        'tax_type',
        'rate',
        'is_active',
    ];

    public function taxRules()
    {
        return $this->hasMany(TaxRule::class);
    }
}

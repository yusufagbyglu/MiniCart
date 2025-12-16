<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaxRule extends Model
{
    use HasFactory;

    protected $fillable = [
        'tax_class_id',
        'tax_rate_id',
        'priority',
    ];

    public function taxClass()
    {
        return $this->belongsTo(TaxClass::class);
    }

    public function taxRate()
    {
        return $this->belongsTo(TaxRate::class);
    }
}

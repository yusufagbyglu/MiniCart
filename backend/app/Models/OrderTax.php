<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderTax extends Model
{
    public $timestamps = false; // Based on schema (created_at only, often implies simplified handling, but Laravel defaults usually fine. Schema had created_at explicit)
    // Actually schema had created_at but no updated_at for order_tax.

    protected $fillable = [
        'order_id',
        'tax_rate_id',
        'tax_amount',
        'rate',
        'created_at'
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function taxRate(): BelongsTo
    {
        return $this->belongsTo(TaxRate::class); // Assuming TaxRate model exists
    }
}

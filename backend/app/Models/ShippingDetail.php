<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShippingDetail extends Model
{
    protected $fillable = [
        'order_id',
        'tracking_number',
        'shipped_at',
        'delivered_at',
        'carrier',
        'shipping_cost'
    ];

    protected $casts = [
        'shipped_at' => 'datetime',
        'delivered_at' => 'datetime'
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}

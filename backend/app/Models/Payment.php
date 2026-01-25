<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $fillable = [
        'order_id',
        'amount',
        'method',
        'status',
        'transaction_id',
        'payment_details',
        'currency'
    ];

    protected $casts = [
        'payment_details' => 'array',
        'amount' => 'decimal:2'
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function refunds()
    {
        return $this->hasMany(Refund::class);
    }

    public function getTotalRefundedAttribute()
    {
        return $this->refunds()->where('status', 'completed')->sum('amount');
    }

    public function isFullyRefunded(): bool
    {
        return $this->total_refunded >= $this->amount;
    }

    public function isRefundable(): bool
    {
        return $this->status === 'completed' && !$this->isFullyRefunded();
    }
}

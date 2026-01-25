<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Refund extends Model
{
    protected $fillable = [
        'payment_id',
        'order_id',
        'amount',
        'reason',
        'notes',
        'status',
        'refund_transaction_id',
        'refund_details',
        'processed_by',
        'processed_at'
    ];

    protected $casts = [
        'refund_details' => 'array',
        'processed_at' => 'datetime',
        'amount' => 'decimal:2'
    ];

    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class);
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function processedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by');
    }
}

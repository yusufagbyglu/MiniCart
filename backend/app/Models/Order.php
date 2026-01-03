<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Order extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'shipping_address_id',
        'billing_address_id',
        'status',
        'total_amount',
        'tax_amount',
        'discount_amount',
        'order_number',
        'currency',
        'exchange_rate',
        'notes'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function shippingAddress(): BelongsTo
    {
        return $this->belongsTo(UserAddress::class, 'shipping_address_id');
    }

    public function billingAddress(): BelongsTo
    {
        return $this->belongsTo(UserAddress::class, 'billing_address_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function currentStatus(): string
    {
        return $this->status;
    }

    public function taxes(): HasMany
    {
        return $this->hasMany(OrderTax::class);
    }

    public function coupons(): HasMany
    {
        return $this->hasMany(OrderCoupon::class);
    }
}

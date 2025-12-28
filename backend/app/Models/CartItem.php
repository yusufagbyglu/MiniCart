<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CartItem extends Model
{
    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = ['cart_id', 'product_id', 'quantity'];

    /**
     * Get the cart that owns the cart item.
     */
    public function cart()
    {
        return $this->belongsTo(Cart::class);
    }

    /**
     * Get the product that the cart item belongs to.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}

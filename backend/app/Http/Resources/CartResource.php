<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'items' => CartItemResource::collection($this->whenLoaded('items')),
            'items_count' => $this->whenCounted('items'),
            'subtotal' => $this->items->sum(function ($item) {
                return $item->quantity * $item->price;
            }),
            'coupon' => $this->coupon ? [
                'code' => $this->coupon->code,
                'discount_type' => $this->coupon->discount_type,
                'discount_value' => $this->coupon->discount_value,
            ] : null,
            'discount_amount' => $this->when($this->coupon, function () {
                $subtotal = $this->items->sum(fn($i) => $i->quantity * $i->price);
                if ($this->coupon->discount_type === 'percentage') {
                    return round($subtotal * ($this->coupon->discount_value / 100), 2);
                }
                return $this->coupon->discount_value;
            }, 0),
            'total' => $this->when(true, function () {
                $subtotal = $this->items->sum(fn($i) => $i->quantity * $i->price);
                $discount = 0;
                if ($this->coupon) {
                    if ($this->coupon->discount_type === 'percentage') {
                        $discount = round($subtotal * ($this->coupon->discount_value / 100), 2);
                    } else {
                        $discount = $this->coupon->discount_value;
                    }
                }
                return max(0, $subtotal - $discount);
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

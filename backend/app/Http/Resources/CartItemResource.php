<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\ProductResource;

class CartItemResource extends JsonResource
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
            'product_id' => $this->product_id,
            'product' => new ProductResource($this->whenLoaded('product')),
            'quantity' => $this->quantity,
            'price' => $this->price, // Exposed snapshot price
            'subtotal' => $this->quantity * $this->price, // content: $this->when($this->relationLoaded('product'), function () { return $this->quantity * $this->product->price; }),

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

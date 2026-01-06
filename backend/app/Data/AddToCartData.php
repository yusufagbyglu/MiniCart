<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class AddToCartData extends Data
{
    public function __construct(
        public int $product_id,
        public int $quantity,
        public ?string $session_id = null,
    ) {
    }

    public static function rules($context = null): array
    {
        return [
            'product_id' => ['required', 'exists:products,id'],
            'quantity' => ['required', 'integer', 'min:1'],
            'session_id' => ['nullable', 'string'],
        ];
    }
}

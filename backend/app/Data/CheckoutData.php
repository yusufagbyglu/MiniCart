<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class CheckoutData extends Data
{
    public function __construct(
        public int $shipping_address_id,
        public int $billing_address_id,
        public string $payment_method,
        public ?string $notes
    ) {
    }

    public static function rules($context = null): array
    {
        return [
            'shipping_address_id' => ['required', 'exists:user_addresses,id'],
            'billing_address_id' => ['required', 'exists:user_addresses,id'],
            'payment_method' => ['required', 'in:fake,stripe,credit_card,bank_transfer'],
            'notes' => ['nullable', 'string'],
        ];
    }
}

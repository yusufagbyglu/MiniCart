<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class PaymentData extends Data
{
    public function __construct(
        public int $order_id,
        public string $method,
        public ?string $payment_token = null,
    ) {
    }

    public static function rules($context = null): array
    {
        return [
            'order_id' => ['required', 'exists:orders,id'],
            'method' => ['required', 'in:fake,stripe,credit_card,bank_transfer'],
            'payment_token' => ['nullable', 'string'],
        ];
    }
}

<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use Carbon\Carbon;

class CouponData extends Data
{
    public function __construct(
        public string $code,
        public string $discount_type,
        public float $discount_value,
        public ?float $min_order_amount = null,
        public Carbon $valid_from,
        public Carbon $valid_until,
        public ?int $max_uses = null,
        public bool $is_active = true,
    ) {
    }

    public static function rules($context = null): array
    {
        $couponId = $context?->payload['id'] ?? null;

        return [
            'code' => ['required', 'string', 'max:255', 'unique:coupons,code' . ($couponId ? ",{$couponId}" : '')],
            'discount_type' => ['required', 'in:percentage,fixed'],
            'discount_value' => ['required', 'numeric', 'min:0'],
            'min_order_amount' => ['nullable', 'numeric', 'min:0'],
            'valid_from' => ['required', 'date'],
            'valid_until' => ['required', 'date', 'after:valid_from'],
            'max_uses' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean']
        ];
    }
}

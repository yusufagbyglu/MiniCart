<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class UpdateOrderStatusData extends Data
{
    public function __construct(
        public string $status,
    ) {
    }

    public static function rules($context = null): array
    {
        return [
            'status' => [
                'required',
                'string',
                'in:pending,confirmed,processing,shipped,delivered,cancelled,refunded'
            ],
        ];
    }
}

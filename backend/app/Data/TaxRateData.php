<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class TaxRateData extends Data
{
    public function __construct(
        public string $name,
        public string $country,
        public ?string $state,
        public float $rate,
        public string $tax_type,
        public bool $is_active = true,
    ) {
    }

    public static function rules($context = null): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'country' => ['required', 'string', 'size:2'],
            'state' => ['nullable', 'string', 'max:255'],
            'rate' => ['required', 'numeric', 'min:0', 'max:100'],
            'tax_type' => ['required', 'string', 'in:vat,sales,gst,hst,pst,service,custom'],
            'is_active' => ['boolean'],
        ];
    }
}

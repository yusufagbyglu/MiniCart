<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class AddressData extends Data
{
    public function __construct(
        public string $address_type,
        public string $full_name,
        public string $address_line1,
        public ?string $address_line2,
        public string $city,
        public ?string $state,
        public string $country,
        public string $postal_code,
        public ?string $phone,
        public bool $is_default = false,
    ) {
    }

    public static function rules($context = null): array
    {
        return [
            'address_type' => ['required', 'in:shipping,billing'],
            'full_name' => ['required', 'string', 'max:255'],
            'address_line1' => ['required', 'string', 'max:255'],
            'address_line2' => ['nullable', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'state' => ['nullable', 'string', 'max:255'],
            'country' => ['required', 'string', 'max:255'],
            'postal_code' => ['required', 'string', 'max:20'],
            'phone' => ['nullable', 'string', 'max:20'],
            'is_default' => ['sometimes', 'boolean'],
        ];
    }
}

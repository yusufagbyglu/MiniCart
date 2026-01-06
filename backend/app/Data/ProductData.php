<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use Illuminate\Http\UploadedFile;

class ProductData extends Data
{
    public function __construct(
        public string $name,
        public string $description,
        public float $price,
        public float $stock,
        public string $sku,
        public int $category_id,
        public ?string $base_currency = 'USD',
        public ?int $tax_class_id = null,
        public ?float $weight = null,
        public ?float $length = null,
        public ?float $width = null,
        public ?float $height = null,
        public bool $featured = false,
        public bool $is_active = true,
        /** @var UploadedFile[]|null */
        public ?array $images = null,
    ) {
    }

    public static function rules($context = null): array
    {
        $productId = $context?->payload['id'] ?? null;

        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'base_currency' => ['required', 'string', 'size:3'],
            'stock' => ['required', 'integer', 'min:0'],
            'sku' => ['required', 'string', 'max:255', 'unique:products,sku' . ($productId ? ",{$productId}" : '')],
            'category_id' => ['required', 'exists:categories,id'],
            'tax_class_id' => ['nullable', 'exists:tax_classes,id'],
            'weight' => ['nullable', 'numeric', 'min:0'],
            'length' => ['nullable', 'numeric', 'min:0'],
            'width' => ['nullable', 'numeric', 'min:0'],
            'height' => ['nullable', 'numeric', 'min:0'],
            'featured' => ['boolean'],
            'is_active' => ['boolean'],
            'images' => ['nullable', 'array'],
            'images.*' => ['image', 'mimes:jpeg,png,jpg,gif', 'max:2048']
        ];
    }
}

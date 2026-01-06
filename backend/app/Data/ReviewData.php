<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class ReviewData extends Data
{
    public function __construct(
        public int $rating,
        public ?string $title,
        public ?string $comment,
    ) {
    }

    public static function rules($context = null): array
    {
        return [
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'title' => ['nullable', 'string', 'max:255'],
            'comment' => ['nullable', 'string'],
        ];
    }
}

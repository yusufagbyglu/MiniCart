<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CouponResource extends JsonResource
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
            'code' => $this->code,
            'description' => $this->description,
            'discount_type' => $this->discount_type,
            'discount_value' => $this->discount_value,
            'min_spend' => $this->min_spend,
            'max_spend' => $this->max_spend,
            'usage_limit' => $this->usage_limit,
            'usage_count' => $this->usage_count,
            'valid_from' => $this->valid_from,
            'valid_until' => $this->valid_until,
            'is_active' => $this->is_active ?? true,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

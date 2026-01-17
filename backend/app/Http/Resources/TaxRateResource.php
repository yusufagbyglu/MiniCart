<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaxRateResource extends JsonResource
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
            'name' => $this->name,
            'country' => $this->country,
            'state' => $this->state,
            'city' => $this->city,
            'tax_type' => $this->tax_type,
            'rate' => $this->rate,
            'is_active' => $this->is_active ?? true,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

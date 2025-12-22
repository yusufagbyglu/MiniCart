<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
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
            'description' => $this->description,
            'parent_id' => $this->parent_id,

            'parent' => $this->whenLoaded('parent', function () {
                return [
                    'id' => $this->parent->id,
                    'name' => $this->parent->name,
                ];
            }),

            'children' => CategoryResource::collection($this->whenLoaded('children')),
            'all_children'=> CategoryResource::collection($this->whenLoaded('all_children')),
            'products_count' => $this->whenCounted('products'),

            'is_parent' => $this->isParent(),
            'has_children' => $this->hasChildren(),
            'depth' => $this->getDepth(),
            'path' => $this->path,

            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}

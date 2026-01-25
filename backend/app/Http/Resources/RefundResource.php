<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RefundResource extends JsonResource
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
            'payment_id' => $this->payment_id,
            'order_id' => $this->order_id,
            'amount' => $this->amount,
            'reason' => $this->reason,
            'notes' => $this->notes,
            'status' => $this->status,
            'refund_transaction_id' => $this->refund_transaction_id,
            'processed_by' => $this->processed_by,
            'processed_at' => $this->processed_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'processed_by_user' => $this->whenLoaded('processedBy', function () {
                return [
                    'id' => $this->processedBy->id,
                    'name' => $this->processedBy->name,
                    'email' => $this->processedBy->email,
                ];
            }),
            'order' => new OrderResource($this->whenLoaded('order')),
        ];
    }
}

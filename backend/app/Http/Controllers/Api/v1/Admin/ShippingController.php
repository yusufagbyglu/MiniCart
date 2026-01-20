<?php

namespace App\Http\Controllers\Api\v1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\ShippingDetail;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ShippingController extends Controller
{
    public function update(Request $request, $orderId)
    {
        $order = Order::findOrFail($orderId);
        $this->authorize('update', $order); // Reuse order update policy or create specific shipping policy

        $request->validate([
            'carrier' => 'required|string',
            'tracking_number' => 'required|string',
            'shipped_at' => 'nullable|date',
            'shipping_cost' => 'nullable|numeric|min:0'
        ]);

        $shippingDetail = $order->shippingDetails()->updateOrCreate(
            ['order_id' => $order->id],
            [
                'carrier' => $request->carrier,
                'tracking_number' => $request->tracking_number,
                'shipped_at' => $request->shipped_at ? Carbon::parse($request->shipped_at) : now(),
                'shipping_cost' => $request->shipping_cost ?? 0
            ]
        );

        // Update order status if not already shipped/delivered
        if (!in_array($order->status, ['shipped', 'delivered'])) {
            $order->update(['status' => 'shipped']);
        }

        return response()->json($shippingDetail);
    }

    public function markAsDelivered($orderId)
    {
        $order = Order::findOrFail($orderId);
        $this->authorize('update', $order);

        $order->update(['status' => 'delivered']);

        $order->shippingDetails()->updateOrCreate(
            ['order_id' => $order->id],
            ['delivered_at' => now()]
        );

        return response()->json(['message' => 'Order marked as delivered']);
    }
}

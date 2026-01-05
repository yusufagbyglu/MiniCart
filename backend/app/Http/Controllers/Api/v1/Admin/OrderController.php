<?php

namespace App\Http\Controllers\Api\v1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Order::class);
        $orders = Order::with('user')->latest()->paginate(20);
        return response()->json($orders);
    }

    public function show($id)
    {
        $order = Order::with(['items.product', 'user', 'shippingAddress'])->findOrFail($id);
        $this->authorize('view', $order);
        return response()->json($order);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,processing,shipped,delivered,cancelled,refunded'
        ]);

        $order = Order::findOrFail($id);
        $this->authorize('updateStatus', $order);
        $order->update(['status' => $request->status]);

        return response()->json(['message' => 'Order status updated', 'order' => $order]);
    }

    public function stats()
    {
        $this->authorize('viewStats', Order::class);
        $totalOrders = Order::count();
        $totalRevenue = Order::where('status', '!=', 'cancelled')->sum('total_amount');

        return response()->json([
            'total_orders' => $totalOrders,
            'total_revenue' => $totalRevenue
        ]);
    }
}

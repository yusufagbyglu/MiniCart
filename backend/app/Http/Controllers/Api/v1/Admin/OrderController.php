<?php

namespace App\Http\Controllers\Api\v1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use App\Data\UpdateOrderStatusData;
use App\Http\Resources\OrderResource;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Order::class);

        $query = Order::with(['user']);

        // Search by order number or customer name/email
        $query->when($request->query('search'), function ($query, $search) {
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        });

        // Filter by status
        $query->when($request->query('status'), function ($query, $status) {
            $query->where('status', $status);
        });

        // Filter by date range
        $query->when($request->query('start_date'), function ($query, $startDate) {
            $query->whereDate('created_at', '>=', $startDate);
        });
        $query->when($request->query('end_date'), function ($query, $endDate) {
            $query->whereDate('created_at', '<=', $endDate);
        });

        $sortField = $request->query('sort', 'created_at');
        $sortDirection = $request->query('order', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $perPage = $request->query('per_page', 20);
        $orders = $query->paginate($perPage);

        return OrderResource::collection($orders);
    }

    public function show($id)
    {
        $order = Order::with(['items.product', 'user', 'shippingAddress'])->findOrFail($id);
        $this->authorize('view', $order);
        return response()->json($order);
    }

    public function updateStatus(UpdateOrderStatusData $data, $id)
    {
        $order = Order::findOrFail($id);
        $this->authorize('updateStatus', $order);
        $order->update(['status' => $data->status]);

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

<?php

namespace App\Http\Controllers\Api\v1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Payment\RefundRequest;
use App\Http\Resources\PaymentResource;
use App\Http\Resources\RefundResource;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Refund;
use App\Services\RefundService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminPaymentController extends Controller
{
    protected RefundService $refundService;

    public function __construct(RefundService $refundService)
    {
        $this->refundService = $refundService;
    }

    /**
     * Get paginated list of all payments with filters
     */
    public function index(Request $request)
    {
        // Basic authorization check
        // $this->authorize('viewAny', Payment::class);

        $query = Payment::with(['order', 'refunds']);

        // Search by transaction ID or order number
        $query->when($request->query('search'), function ($query, $search) {
            $query->where(function ($q) use ($search) {
                $q->where('transaction_id', 'like', "%{$search}%")
                    ->orWhereHas('order', function ($oq) use ($search) {
                        $oq->where('order_number', 'like', "%{$search}%");
                    });
            });
        });

        // Filter by payment method
        $query->when($request->query('method'), function ($query, $method) {
            $query->where('method', $method);
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

        // Sorting
        $sortField = $request->query('sort', 'created_at');
        $sortDirection = $request->query('order', 'desc');

        $allowedSortFields = ['created_at', 'amount', 'status', 'method'];
        if (in_array($sortField, $allowedSortFields)) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $perPage = $request->query('per_page', 20);
        $payments = $query->paginate($perPage);

        return PaymentResource::collection($payments);
    }

    /**
     * Get a single payment with details
     */
    public function show($id)
    {
        $payment = Payment::with(['order.user', 'order.items.product', 'refunds.processedBy'])->findOrFail($id);
        // $this->authorize('view', $payment);

        return new PaymentResource($payment);
    }

    /**
     * Process a refund for an order
     */
    public function refund(RefundRequest $request, $orderId)
    {
        $order = Order::with('payment')->findOrFail($orderId);

        // Authorization check
        // $this->authorize('refund', $order);

        try {
            $refund = $this->refundService->processRefund(
                $order,
                $request->validated(),
                Auth::id()
            );

            return response()->json([
                'message' => 'Refund processed successfully',
                'refund' => new RefundResource($refund->load('processedBy'))
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Refund failed',
                'error' => $e->getMessage()
            ], 422);
        }
    }

    /**
     * Get all refunds with pagination
     */
    public function refunds(Request $request)
    {
        $query = Refund::with(['order', 'payment', 'processedBy']);

        // Filter by status
        $query->when($request->query('status'), function ($query, $status) {
            $query->where('status', $status);
        });

        // Filter by reason
        $query->when($request->query('reason'), function ($query, $reason) {
            $query->where('reason', $reason);
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

        $allowedSortFields = ['created_at', 'amount', 'status'];
        if (in_array($sortField, $allowedSortFields)) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $perPage = $request->query('per_page', 20);
        $refunds = $query->paginate($perPage);

        return RefundResource::collection($refunds);
    }

    /**
     * Get payment and refund statistics
     */
    public function stats()
    {
        // $this->authorize('viewStats', Payment::class);

        $totalPayments = Payment::count();
        $totalRevenue = Payment::where('status', 'completed')->sum('amount');
        $totalRefunded = Refund::where('status', 'completed')->sum('amount');
        $pendingPayments = Payment::where('status', 'pending')->count();
        $failedPayments = Payment::where('status', 'failed')->count();
        $refundStats = $this->refundService->getRefundStats();

        return response()->json([
            'total_payments' => $totalPayments,
            'total_revenue' => $totalRevenue,
            'total_refunded' => $totalRefunded,
            'pending_payments' => $pendingPayments,
            'failed_payments' => $failedPayments,
            'refund_stats' => $refundStats
        ]);
    }
}

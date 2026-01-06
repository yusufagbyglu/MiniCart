<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Data\PaymentData;

class PaymentController extends Controller
{
    public function process(PaymentData $data)
    {
        $order = Order::findOrFail($data->order_id);

        $this->authorize('update', $order);

        // Security check: ensure order belongs to user
        if ($order->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($order->status !== 'pending') {
            return response()->json(['message' => 'Order is not in pending state.'], 400);
        }

        // Mock Payment Processing
        $method = $data->method;
        $status = 'completed';
        $transactionId = 'tx_' . uniqid();

        // In a real implementation:
        // if ($method === 'stripe') { $status = StripeService::charge(...); }

        try {
            DB::transaction(function () use ($order, $data, $transactionId, $method) {
                Payment::create([
                    'order_id' => $order->id,
                    'amount' => $order->total_amount,
                    'method' => $method,
                    'status' => 'completed',
                    'transaction_id' => $transactionId,
                    'currency' => $order->currency,
                    'payment_details' => json_encode($data->toArray()),
                ]);

                // Update Order Status
                $order->update(['status' => 'processing']);
            });

            return response()->json([
                'message' => 'Payment processed successfully',
                'transaction_id' => $transactionId,
                'status' => 'completed'
            ]);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Payment processing error', 'error' => $e->getMessage()], 500);
        }
    }

    public function status($orderId)
    {
        $order = Order::findOrFail($orderId);

        $this->authorize('view', $order);

        if ($order->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $payment = Payment::where('order_id', $orderId)->latest()->first();

        if (!$payment) {
            return response()->json(['status' => 'unpaid', 'message' => 'No payment record found']);
        }

        return response()->json(['status' => $payment->status, 'payment' => $payment]);
    }
}

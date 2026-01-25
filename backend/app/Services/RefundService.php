<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Payment;
use App\Models\Refund;
use Illuminate\Support\Facades\DB;
use Exception;

class RefundService
{
    /**
     * Process a full or partial refund for an order
     *
     * @param Order $order
     * @param array $data ['amount', 'reason', 'notes']
     * @param int $processedBy User ID of admin processing the refund
     * @return Refund
     * @throws Exception
     */
    public function processRefund(Order $order, array $data, int $processedBy): Refund
    {
        DB::beginTransaction();

        try {
            // Validate order has payment
            $payment = $order->payment;
            if (!$payment) {
                throw new Exception('Order has no payment to refund');
            }

            // Validate payment is completed
            if ($payment->status !== 'completed') {
                throw new Exception('Can only refund completed payments');
            }

            // Validate refund amount
            $refundAmount = floatval($data['amount']);
            $totalRefunded = $payment->total_refunded ?? 0;
            $remainingAmount = $payment->amount - $totalRefunded;

            if ($refundAmount <= 0) {
                throw new Exception('Refund amount must be greater than zero');
            }

            if ($refundAmount > $remainingAmount) {
                throw new Exception("Refund amount cannot exceed remaining amount: $remainingAmount");
            }

            // Create refund record
            $refund = Refund::create([
                'payment_id' => $payment->id,
                'order_id' => $order->id,
                'amount' => $refundAmount,
                'reason' => $data['reason'],
                'notes' => $data['notes'] ?? null,
                'status' => 'processing',
                'processed_by' => $processedBy,
                'processed_at' => now()
            ]);

            // Process refund through payment gateway
            $gatewayResult = $this->processGatewayRefund($payment, $refundAmount);

            // Update refund with gateway response
            $refund->update([
                'status' => $gatewayResult['success'] ? 'completed' : 'failed',
                'refund_transaction_id' => $gatewayResult['transaction_id'] ?? null,
                'refund_details' => $gatewayResult['details'] ?? null
            ]);

            if (!$gatewayResult['success']) {
                throw new Exception($gatewayResult['error'] ?? 'Gateway refund failed');
            }

            // Update payment status if fully refunded
            if ($payment->isFullyRefunded()) {
                $payment->update(['status' => 'refunded']);
            }

            // Update order status to refunded
            $order->update(['status' => 'refunded']);

            DB::commit();

            return $refund;

        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Process refund through payment gateway
     *
     * @param Payment $payment
     * @param float $amount
     * @return array
     */
    protected function processGatewayRefund(Payment $payment, float $amount): array
    {
        $method = $payment->method;

        switch ($method) {
            case 'stripe':
                return $this->processStripeRefund($payment, $amount);

            case 'paypal':
                return $this->processPayPalRefund($payment, $amount);

            case 'fake':
            case 'credit_card':
            case 'bank_transfer':
            default:
                // Mock refund for non-integrated gateways
                return [
                    'success' => true,
                    'transaction_id' => 'REFUND_' . strtoupper(uniqid()),
                    'details' => [
                        'method' => $method,
                        'amount' => $amount,
                        'mock' => true,
                        'processed_at' => now()->toISOString()
                    ]
                ];
        }
    }

    /**
     * Process Stripe refund
     *
     * @param Payment $payment
     * @param float $amount
     * @return array
     */
    protected function processStripeRefund(Payment $payment, float $amount): array
    {
        // TODO: Integrate with Stripe API
        // This is a placeholder implementation
        // In production, use Stripe SDK:
        // \Stripe\Stripe::setApiKey(config('services.stripe.secret'));
        // $refund = \Stripe\Refund::create([
        //     'charge' => $payment->transaction_id,
        //     'amount' => $amount * 100, // Stripe uses cents
        // ]);

        return [
            'success' => true,
            'transaction_id' => 'STRIPE_REFUND_' . uniqid(),
            'details' => [
                'gateway' => 'stripe',
                'original_transaction' => $payment->transaction_id,
                'amount' => $amount,
                'note' => 'TODO: Integrate actual Stripe API'
            ]
        ];
    }

    /**
     * Process PayPal refund
     *
     * @param Payment $payment
     * @param float $amount
     * @return array
     */
    protected function processPayPalRefund(Payment $payment, float $amount): array
    {
        // TODO: Integrate with PayPal API
        // This is a placeholder implementation
        // In production, use PayPal SDK

        return [
            'success' => true,
            'transaction_id' => 'PAYPAL_REFUND_' . uniqid(),
            'details' => [
                'gateway' => 'paypal',
                'original_transaction' => $payment->transaction_id,
                'amount' => $amount,
                'note' => 'TODO: Integrate actual PayPal API'
            ]
        ];
    }

    /**
     * Get refund statistics
     *
     * @return array
     */
    public function getRefundStats(): array
    {
        $totalRefunds = Refund::where('status', 'completed')->count();
        $totalRefundAmount = Refund::where('status', 'completed')->sum('amount');
        $pendingRefunds = Refund::where('status', 'processing')->count();

        return [
            'total_refunds' => $totalRefunds,
            'total_refund_amount' => $totalRefundAmount,
            'pending_refunds' => $pendingRefunds
        ];
    }
}

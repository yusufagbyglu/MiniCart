<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Cart;
use App\Models\Product;
use App\Models\OrderTax;
use App\Models\TaxRate;
use App\Models\OrderCoupon;
use App\Models\UserAddress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    /**
     * Checkout logic: Convert Cart to Order.
     */
    public function checkout(Request $request)
    {
        $this->authorize('create', Order::class);
        $user = $request->user();

        $validated = $request->validate([
            'shipping_address_id' => 'required|exists:user_addresses,id',
            'billing_address_id' => 'required|exists:user_addresses,id',
            'payment_method' => 'required|in:fake,stripe,credit_card,bank_transfer',
            'notes' => 'nullable|string'
        ]);

        // Get Cart
        $cart = Cart::with(['items.product', 'coupon'])->where('user_id', $user->id)->first();

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 400);
        }

        // Verify Addresses belong to user
        $shippingAddress = UserAddress::where('id', $validated['shipping_address_id'])
            ->where('user_id', $user->id)
            ->firstOrFail();

        // 1. Calculate Subtotal
        $subtotal = $cart->items->sum(function ($item) {
            return $item->quantity * $item->price;
        });

        // 2. Calculate Discount
        $discountAmount = 0;
        if ($cart->coupon) {
            if ($cart->coupon->discount_type === 'percentage') {
                $discountAmount = round($subtotal * ($cart->coupon->discount_value / 100), 2);
            } else {
                $discountAmount = $cart->coupon->discount_value;
            }
        }
        // Ensure discount doesn't exceed subtotal
        $discountAmount = min($discountAmount, $subtotal);
        $taxableAmount = $subtotal - $discountAmount;

        // 3. Calculate Tax
        // Simple logic: Find tax rule for shipping country/state
        // For MiniCart simplicity, let's grab the first matching tax rate or default
        // In a real app, this uses a robust Tax Engine.
        $taxRateRecord = TaxRate::where('country', $shippingAddress->country)
            ->where(function ($q) use ($shippingAddress) {
                $q->where('state', $shippingAddress->state)
                    ->orWhereNull('state');
            })
            ->where('is_active', true)
            ->orderByDesc('state') // Prioritize state-specific rules
            ->first();

        $taxAmount = 0;
        $appliedRate = 0;
        if ($taxRateRecord) {
            $appliedRate = $taxRateRecord->rate;
            $taxAmount = round($taxableAmount * ($appliedRate / 100), 2);
        }

        $totalAmount = $taxableAmount + $taxAmount;

        // DB Transaction
        return DB::transaction(function () use ($user, $cart, $validated, $subtotal, $discountAmount, $taxAmount, $totalAmount, $taxRateRecord, $appliedRate) {

            // Create Order
            $order = Order::create([
                'user_id' => $user->id,
                'shipping_address_id' => $validated['shipping_address_id'],
                'billing_address_id' => $validated['billing_address_id'],
                'status' => 'pending',
                'total_amount' => $totalAmount,
                'tax_amount' => $taxAmount,
                'discount_amount' => $discountAmount,
                'order_number' => 'ORD-' . strtoupper(Str::random(10)), // or sequential logic
                'currency' => 'USD',
                'notes' => $validated['notes'] ?? null
            ]);

            // Create Order Items
            foreach ($cart->items as $cartItem) {
                $order->items()->create([
                    'product_id' => $cartItem->product_id,
                    'quantity' => $cartItem->quantity,
                    'unit_price' => $cartItem->price,
                    'total_price' => $cartItem->quantity * $cartItem->price
                ]);
                // Decrement stock? Not explicit in Cart task but polite to do.
                // $cartItem->product->decrement('stock', $cartItem->quantity); // If product has stock
            }

            // Create Order Tax Detail
            if ($taxRateRecord) {
                OrderTax::create([
                    'order_id' => $order->id,
                    'tax_rate_id' => $taxRateRecord->id,
                    'tax_amount' => $taxAmount,
                    'rate' => $appliedRate
                ]);
            }

            // Create Order Coupon Detail
            if ($cart->coupon) {
                OrderCoupon::create([
                    'order_id' => $order->id,
                    'coupon_id' => $cart->coupon_id,
                    'discount_amount' => $discountAmount
                ]);
                $cart->coupon->increment('used_count');
            }

            // Clear Cart
            $cart->items()->delete();
            $cart->update(['coupon_id' => null]); // Remove coupon association

            return response()->json([
                'success' => true,
                'message' => 'Order placed successfully',
                'data' => $order->load(['items', 'taxes'])
            ], 201);
        });
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', Order::class);
        $orders = Order::where('user_id', $request->user()->id)
            ->with(['items', 'items.product'])
            ->orderByDesc('created_at')
            ->paginate(10);

        return response()->json($orders);
    }

    public function show(Request $request, $orderNumber)
    {
        $order = Order::where('user_id', $request->user()->id)
            ->where('order_number', $orderNumber)
            ->with(['items.product', 'taxes', 'coupons', 'shippingAddress', 'billingAddress'])
            ->firstOrFail();

        $this->authorize('view', $order);

        return response()->json(['success' => true, 'data' => $order]);
    }

    public function cancel(Request $request, $orderNumber)
    {
        $order = Order::where('user_id', $request->user()->id)
            ->where('order_number', $orderNumber)
            ->firstOrFail();

        $this->authorize('cancel', $order);

        if (!in_array($order->status, ['pending', 'confirmed'])) {
            return response()->json(['success' => false, 'message' => 'Order cannot be cancelled in current status'], 400);
        }

        $order->update(['status' => 'cancelled']);

        // Potential logic: Release stock, void payment, etc.

        return response()->json(['success' => true, 'message' => 'Order cancelled successfully', 'data' => $order]);
    }
}

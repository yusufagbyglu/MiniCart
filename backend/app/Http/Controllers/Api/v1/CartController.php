<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Coupon;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Http\Resources\CartResource;

class CartController extends Controller
{
    private function getCart(Request $request)
    {
        $user = Auth::guard('sanctum')->user();
        if ($user) {
            return Cart::with(['items.product', 'coupon'])->firstOrCreate(['user_id' => $user->id]);
        }

        $sessionId = $request->header('X-Session-ID') ?? $request->input('session_id');

        if ($sessionId) {
            return Cart::with(['items.product', 'coupon'])->firstOrCreate(['session_id' => $sessionId]);
        }

        return null;
    }

    public function index(Request $request): JsonResponse
    {
        $cart = $this->getCart($request);

        if (!$cart) {
            // If no cart found (e.g. guest without session), return empty structure
            return response()->json([
                'success' => true,
                'data' => null
            ]);
        }

        if ($cart->user_id) {
            $this->authorize('view', $cart);
        }

        return response()->json([
            'success' => true,
            'data' => new CartResource($cart)
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'session_id' => 'nullable|string'
        ]);

        $this->authorize('create', CartItem::class);

        $cart = $this->getCart($request);

        if (!$cart) {
            if ($request->input('session_id')) {
                $cart = Cart::create(['session_id' => $request->input('session_id')]);
            } else {
                return response()->json(['success' => false, 'message' => 'Session ID required for guest users'], 400);
            }
        }

        if ($cart->user_id) {
            $this->authorize('update', $cart); // Treating adding item as updating cart
        }

        $product = Product::findOrFail($validated['product_id']);

        $cartItem = $cart->items()->where('product_id', $product->id)->first();

        if ($cartItem) {
            $cartItem->increment('quantity', $validated['quantity']);
        } else {
            $cart->items()->create([
                'product_id' => $product->id,
                'quantity' => $validated['quantity'],
                'price' => $product->price
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Item added to cart',
            'data' => new CartResource($cart->fresh(['items.product', 'coupon']))
        ], 201);
    }

    public function update(Request $request, $itemId): JsonResponse
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $cart = $this->getCart($request);
        if (!$cart) {
            return response()->json(['success' => false, 'message' => 'Cart not found'], 404);
        }

        $cartItem = $cart->items()->where('id', $itemId)->first();
        if (!$cartItem) {
            return response()->json(['success' => false, 'message' => 'Item not found in cart'], 404);
        }

        if ($cart->user_id) {
            $this->authorize('update', $cartItem);
        }

        $cartItem->update(['quantity' => $validated['quantity']]);

        return response()->json([
            'success' => true,
            'message' => 'Cart updated',
            'data' => new CartResource($cart->fresh(['items.product', 'coupon']))
        ]);
    }

    public function destroy(Request $request, $itemId): JsonResponse
    {
        $cart = $this->getCart($request);
        if (!$cart) {
            return response()->json(['success' => false, 'message' => 'Cart not found'], 404);
        }

        $cartItem = $cart->items()->where('id', $itemId)->first();

        if ($cartItem) {
            if ($cart->user_id) {
                $this->authorize('delete', $cartItem);
            }
            $cartItem->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Item removed from cart',
            'data' => new CartResource($cart->fresh(['items.product', 'coupon']))
        ]);
    }

    public function applyCoupon(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => 'required|string'
        ]);

        $cart = $this->getCart($request);
        if (!$cart) {
            return response()->json(['success' => false, 'message' => 'Cart not found'], 404);
        }

        if ($cart->user_id) {
            $this->authorize('update', $cart);
        }

        $coupon = Coupon::where('code', $validated['code'])->first();

        if (!$coupon) {
            return response()->json(['success' => false, 'message' => 'Invalid coupon code'], 404);
        }

        // Validity checks
        $now = Carbon::now();
        if (
            !$coupon->is_active ||
            ($coupon->valid_from && $now->lt($coupon->valid_from)) ||
            ($coupon->valid_until && $now->gt($coupon->valid_until))
        ) {
            return response()->json(['success' => false, 'message' => 'Coupon provided is not active or expired'], 400);
        }

        if ($coupon->max_uses && $coupon->used_count >= $coupon->max_uses) {
            return response()->json(['success' => false, 'message' => 'Coupon usage limit reached'], 400);
        }

        // Check min order amount?
        // Need to calculate cart total first.
        $total = $cart->items->sum(function ($item) {
            return $item->quantity * $item->price;
        });

        if ($coupon->min_order_amount && $total < $coupon->min_order_amount) {
            return response()->json(['success' => false, 'message' => 'Minimum order amount not met for this coupon'], 400);
        }

        $cart->update(['coupon_id' => $coupon->id]);

        return response()->json([
            'success' => true,
            'message' => 'Coupon applied',
            'data' => new CartResource($cart->fresh(['items.product', 'coupon']))
        ]);
    }

    public function removeCoupon(Request $request): JsonResponse
    {
        $cart = $this->getCart($request);
        if ($cart) {
            if ($cart->user_id) {
                $this->authorize('update', $cart);
            }
            $cart->update(['coupon_id' => null]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Coupon removed',
            'data' => $cart ? new CartResource($cart->fresh(['items.product', 'coupon'])) : null
        ]);
    }
}

<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $cart = Cart::with(['items.product'])
            ->firstOrCreate(['user_id' => Auth::id()]);
        return response()->json(
            [
                'success' => true,
                'data' => $cart
            ]
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);
        $cart = Cart::firstOrCreate(['user_id' => Auth::id()]);
        // Check if product already in cart
        $cartItem = $cart->items()->where('product_id', $validated['product_id'])->first();
        if ($cartItem) {
            $cartItem->increment('quantity', $validated['quantity']);
        } else {
            $cart->items()->create([
                'product_id' => $validated['product_id'],
                'quantity' => $validated['quantity']
            ]);
        }
        return response()->json([
            'success' => true,
            'message' => 'Item added to cart',
            'data' => $cart->load('items.product')
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Cart $cart): JsonResponse
    {
        $this->authorize('view', $cart);
        return response()->json(
            [
                'success' => true,
                'data' => $cart->load('items.product')
            ]
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CartItem $cartItem): JsonResponse
    {
        $this->authorize('update', $cartItem);
        
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);
        $cartItem->update(['quantity' => $validated['quantity']]);
        return response()->json([
            'success' => true,
            'message' => 'Cart updated',
            'data' => $cartItem->cart->load('items.product')
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CartItem $cartItem): JsonResponse
    {
        $this->authorize('delete', $cartItem);
        
        $cartItem->delete();
        return response()->json([
            'success' => true,
            'message' => 'Item removed from cart'
        ]);
    }

    /**
     * Clear all items from the cart.
     */
    public function clear(Cart $cart): JsonResponse
    {
        $this->authorize('update', $cart);
        
        $cart->items()->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Cart cleared'
        ]);
    }
}

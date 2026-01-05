<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
    /**
     * Display the user's wishlist.
     */
    public function index()
    {
        $wishlist = Wishlist::with('product') // Eager load product details
            ->where('user_id', Auth::id())
            ->latest()
            ->paginate(20);

        return response()->json($wishlist);
    }

    /**
     * Add a product to the wishlist.
     */
    public function store($productId)
    {
        $this->authorize('create', Wishlist::class);
        $product = Product::findOrFail($productId);
        $user = Auth::user();

        // Check if already in wishlist
        $exists = Wishlist::where('user_id', $user->id)
            ->where('product_id', $product->id)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Product is already in wishlist'], 409);
        }

        $wishlistItem = Wishlist::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
        ]);

        return response()->json([
            'message' => 'Product added to wishlist',
            'item' => $wishlistItem
        ], 201);
    }

    /**
     * Remove a product from the wishlist.
     */
    public function destroy($productId)
    {
        // Try to find the wishlist item by product ID for the current user
        $deleted = Wishlist::where('user_id', Auth::id())
            ->where('product_id', $productId)
            ->delete();

        if ($deleted) {
            return response()->json(['message' => 'Product removed from wishlist']);
        }

        return response()->json(['message' => 'Product not found in wishlist'], 404);
    }
}

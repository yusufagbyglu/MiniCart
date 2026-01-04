<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    /**
     * Display a listing of approved reviews for a product.
     */
    public function index($productId)
    {
        $reviews = Review::with('user:id,name') // Eager load user name
            ->where('product_id', $productId)
            ->where('is_approved', true)
            ->latest()
            ->paginate(10);

        return response()->json($reviews);
    }

    /**
     * Store a newly created review in storage.
     */
    public function store(Request $request, $productId)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'comment' => 'nullable|string',
        ]);

        $product = Product::findOrFail($productId);

        // Check if user already reviewed this product? (Optional, but good practice)
        // For now allowing multiple reviews or relying on frontend checks.

        $review = Review::create([
            'product_id' => $product->id,
            'user_id' => Auth::id(),
            'rating' => $request->rating,
            'title' => $request->title,
            'comment' => $request->comment,
            'is_approved' => false, // Default to pending
        ]);

        return response()->json([
            'message' => 'Review submitted successfully and is pending approval.',
            'review' => $review
        ], 201);
    }

    /**
     * Update the specified review.
     */
    public function update(Request $request, Review $review)
    {
        // Policy check should happen here or via middleware. 
        if ($review->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'rating' => 'integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'comment' => 'nullable|string',
        ]);

        $review->update([
            'rating' => $request->input('rating', $review->rating),
            'title' => $request->input('title', $review->title),
            'comment' => $request->input('comment', $review->comment),
            'is_approved' => false, // Reset approval on edit? Usually yes.
        ]);

        return response()->json([
            'message' => 'Review updated and is pending approval.',
            'review' => $review
        ]);
    }

    /**
     * Remove the specified review.
     */
    public function destroy(Review $review)
    {
        // Allow owner or admin (admin check typically in a separate admin method or robust policy)
        // For now, assuming owner check.
        if ($review->user_id !== Auth::id()) { // AND not admin
            // Simplification: Owners delete their own. Admins delete via Admin routes.
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $review->delete();

        return response()->json(['message' => 'Review deleted successfully.']);
    }
}

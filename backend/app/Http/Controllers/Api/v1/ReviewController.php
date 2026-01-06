<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Data\ReviewData;

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
    public function store(ReviewData $data, $productId)
    {
        $this->authorize('create', Review::class);
        $product = Product::findOrFail($productId);

        $review = Review::create([
            'product_id' => $product->id,
            'user_id' => Auth::id(),
            'rating' => $data->rating,
            'title' => $data->title,
            'comment' => $data->comment,
            'is_approved' => false,
        ]);

        return response()->json([
            'message' => 'Review submitted successfully and is pending approval.',
            'review' => $review
        ], 201);
    }

    /**
     * Update the specified review.
     */
    public function update(ReviewData $data, Review $review)
    {
        $this->authorize('update', $review);

        $review->update([
            'rating' => $data->rating,
            'title' => $data->title,
            'comment' => $data->comment,
            'is_approved' => false,
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
        $this->authorize('delete', $review);

        $review->delete();

        return response()->json(['message' => 'Review deleted successfully.']);
    }
}

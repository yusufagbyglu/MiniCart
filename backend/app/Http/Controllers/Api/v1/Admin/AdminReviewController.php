<?php

namespace App\Http\Controllers\Api\v1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use App\Http\Resources\ReviewResource;
use Illuminate\Support\Facades\DB;

class AdminReviewController extends Controller
{
    public function index(Request $request)
    {
        // Ensure the user can view reviews (handled by policy)
        $this->authorize('viewAny', Review::class);

        $query = Review::with(['product', 'user']);

        // Search
        $query->when($request->query('search'), function ($q, $search) {
            $q->where(function ($subQ) use ($search) {
                $subQ->where('comment', 'like', "%{$search}%")
                    ->orWhere('title', 'like', "%{$search}%")
                    ->orWhereHas('product', function ($pq) use ($search) {
                        $pq->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('name', 'like', "%{$search}%");
                    });
            });
        });

        // Filter by status
        $query->when($request->has('status'), function ($q) use ($request) {
            $status = $request->query('status');
            if ($status === 'approved') {
                $q->where('is_approved', true);
            } elseif ($status === 'pending') {
                $q->where('is_approved', false);
            }
        });

        // Filter by rating
        $query->when($request->query('rating'), function ($q, $rating) {
            if ($rating !== 'all') {
                $q->where('rating', $rating);
            }
        });

        // Sorting
        $sortField = $request->query('sort', 'created_at');
        $sortDirection = $request->query('order', 'desc');

        $allowedSortFields = ['created_at', 'rating', 'id'];
        if (in_array($sortField, $allowedSortFields)) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $perPage = $request->query('per_page', 15);

        return ReviewResource::collection($query->paginate($perPage));
    }

    public function toggleApproval(Review $review)
    {
        $this->authorize('update', $review);

        $review->update([
            'is_approved' => !$review->is_approved,
            'approved_by' => !$review->is_approved ? auth()->id() : null
        ]);

        return response()->json([
            'message' => $review->is_approved ? 'Review approved' : 'Review unapproved',
            'review' => new ReviewResource($review->load(['product', 'user']))
        ]);
    }

    public function destroy(Review $review)
    {
        $this->authorize('delete', $review);
        $review->delete();
        return response()->json(null, 204);
    }

    public function stats()
    {
        $this->authorize('viewAny', Review::class);

        return response()->json([
            'total_reviews' => Review::count(),
            'pending_count' => Review::where('is_approved', false)->count(),
            'average_rating' => (float) Review::avg('rating')
        ]);
    }
}

<?php

namespace App\Policies;

use App\Models\Review;
use App\Models\User;

class ReviewPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('reviews.view');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Review $review): bool
    {
        // Users can view approved reviews, or their own review, or if they have permission to view all
        return $review->is_approved ||
            $user->id === $review->user_id ||
            $user->hasPermissionTo('reviews.view') ||
            $user->hasPermissionTo('reviews.update-all'); // Support staff logic 
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Optionally check if user purchased the product
        return $user->hasPermissionTo('reviews.create');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Review $review): bool
    {
        if ($user->hasPermissionTo('reviews.update-all')) {
            return true;
        }

        return $user->id === $review->user_id && $user->hasPermissionTo('reviews.update-own');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Review $review): bool
    {
        if ($user->hasPermissionTo('reviews.delete-all')) {
            return true;
        }

        return $user->id === $review->user_id && $user->hasPermissionTo('reviews.delete-own');
    }

    /**
     * Determine whether the user can approve reviews.
     */
    public function approve(User $user): bool
    {
        return $user->hasPermissionTo('reviews.approve');
    }
}

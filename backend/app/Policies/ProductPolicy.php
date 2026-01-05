<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Product;
use Illuminate\Auth\Access\HandlesAuthorization;

class ProductPolicy
{
    use HandlesAuthorization;

    /**
     * Determine if the user can view any products.
     */
    public function viewAny(?User $user): bool
    {
        // Anyone can view active products (even guests)
        if (!$user) {
            return true;
        }

        return $user->hasPermissionTo('products.view') ||
            $user->hasPermissionTo('products.view-all');
    }

    /**
     * Determine if the user can view the product.
     */
    public function view(?User $user, Product $product): bool
    {
        // Anyone can view active products
        if ($product->is_active && !$product->deleted_at) {
            return true;
        }

        // Only authenticated users with view-all permission can see inactive/deleted
        return $user && $user->hasPermissionTo('products.view-all');
    }

    /**
     * Determine if the user can create products.
     */
    public function create(User $user): bool
    {
        // Only admin and shop-manager can create
        return $user->hasPermissionTo('products.create');
    }

    /**
     * Determine if the user can update the product.
     */
    public function update(User $user, Product $product): bool
    {
        return $user->hasPermissionTo('products.update');
    }

    /**
     * Determine if the user can delete the product.
     */
    public function delete(User $user, Product $product): bool
    {
        return $user->hasPermissionTo('products.delete');
    }

    /**
     * Determine if the user can restore the product.
     */
    public function restore(User $user, Product $product): bool
    {
        return $user->hasPermissionTo('products.restore');
    }

    /**
     * Determine if the user can permanently delete the product.
     */
    public function forceDelete(User $user, Product $product): bool
    {
        return $user->hasPermissionTo('products.force-delete');
    }

    /**
     * Determine if the user can manage product stock.
     */
    public function manageStock(User $user, Product $product): bool
    {
        return $user->hasPermissionTo('products.manage-stock');
    }

    /**
     * Determine if the user can manage product images.
     */
    public function manageImages(User $user, Product $product): bool
    {
        return $user->hasPermissionTo('products.manage-images');
    }

    /**
     * Determine if the user can set product as featured.
     */
    public function setFeatured(User $user, Product $product): bool
    {
        return $user->hasPermissionTo('products.set-featured');
    }
}
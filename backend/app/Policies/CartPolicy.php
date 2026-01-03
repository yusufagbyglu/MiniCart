<?php

namespace App\Policies;

use App\Models\Cart;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CartPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('cart.view-all');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Cart $cart): bool
    {
        if ($user->hasPermissionTo('cart.view-all')) {
            return true;
        }
        return $user->id === $cart->user_id && $user->hasPermissionTo('cart.manage-own');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Support/Admin or Customer
        return $user->hasPermissionTo('cart.manage-own') || $user->hasPermissionTo('cart.view-all');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Cart $cart): bool
    {
        // Assuming 'view-all' implies support capabilities, or we could add a specific 'cart.manage-any' permission if desired.
        // For now, let's stick to strict ownership for updates unless we add a specific 'cart.manage-all' permission.
        // Checking PermissionSeeder, we assume admins/support might need to inspect but not necessarily modify customer carts actively via API unless acting AS them.
        // However, usually support might need to clear a stuck cart.

        // Let's check PermissionSeeder again via reasoning:
        // 'cart.view-all' exists. 'cart.manage-own' exists.
        // Admin usually has all permissions.

        if ($user->hasRole('admin')) {
            return true;
        }

        return $user->id === $cart->user_id && $user->hasPermissionTo('cart.manage-own');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Cart $cart): bool
    {
        if ($user->hasRole('admin')) {
            return true;
        }
        return $user->id === $cart->user_id && $user->hasPermissionTo('cart.manage-own');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Cart $cart): bool
    {
        return $user->hasPermissionTo('cart.manage-own') || $user->hasRole('admin');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Cart $cart): bool
    {
        return $user->hasRole('admin');
    }
}

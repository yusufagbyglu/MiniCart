<?php

namespace App\Policies;

use App\Models\CartItem;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CartItemPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('cart-items.view');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, CartItem $cartItem): bool
    {
        if ($user->hasPermissionTo('cart.view-all')) {
            return true;
        }
        return $user->id === $cartItem->cart->user_id && ($user->hasPermissionTo('cart-items.view') || $user->hasPermissionTo('cart.manage-own'));
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('cart-items.add');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, CartItem $cartItem): bool
    {
        if ($user->hasRole('admin')) {
            return true;
        }
        return $user->id === $cartItem->cart->user_id && $user->hasPermissionTo('cart-items.update');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, CartItem $cartItem): bool
    {
        if ($user->hasRole('admin')) {
            return true;
        }
        return $user->id === $cartItem->cart->user_id && $user->hasPermissionTo('cart-items.remove');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, CartItem $cartItem): bool
    {
        return $user->hasRole('admin');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, CartItem $cartItem): bool
    {
        return $user->hasRole('admin');
    }
}

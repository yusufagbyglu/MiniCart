<?php

namespace App\Policies;

use App\Models\User;
use App\Models\UserAddress;

class UserAddressPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('addresses.view-all') || $user->hasPermissionTo('addresses.manage-own');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, UserAddress $userAddress): bool
    {
        return $user->hasPermissionTo('addresses.view-all') || ($user->id === $userAddress->user_id && $user->hasPermissionTo('addresses.manage-own'));
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('addresses.manage-own');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, UserAddress $userAddress): bool
    {
        return $user->hasPermissionTo('addresses.view-all') || ($user->id === $userAddress->user_id && $user->hasPermissionTo('addresses.manage-own'));
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, UserAddress $userAddress): bool
    {
        return $user->hasPermissionTo('addresses.view-all') || ($user->id === $userAddress->user_id && $user->hasPermissionTo('addresses.manage-own'));
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, UserAddress $userAddress): bool
    {
        return $user->hasPermissionTo('addresses.view-all') || ($user->id === $userAddress->user_id && $user->hasPermissionTo('addresses.manage-own'));
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, UserAddress $userAddress): bool
    {
        return $user->hasPermissionTo('addresses.view-all') || ($user->id === $userAddress->user_id && $user->hasPermissionTo('addresses.manage-own'));
    }
}

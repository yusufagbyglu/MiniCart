<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;

class OrderPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('orders.view-all');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Order $order): bool
    {
        if ($user->hasPermissionTo('orders.view-all')) {
            return true;
        }

        return $user->id === $order->user_id && $user->hasPermissionTo('orders.view-own');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('orders.create');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Order $order): bool
    {
        // Admin update
        if ($user->hasPermissionTo('orders.update')) {
            return true;
        }

        // User cancelling their own order usually handled by specific logic/permission or endpoint
        return false;
    }

    public function cancel(User $user, Order $order): bool
    {
        if ($user->hasPermissionTo('orders.change-status')) { // Admin override
            return true;
        }

        return $user->id === $order->user_id && $user->hasPermissionTo('orders.cancel');
    }

    // Additional checks for specific actions
    public function updateStatus(User $user, Order $order): bool
    {
        return $user->hasPermissionTo('orders.change-status');
    }

    public function viewStats(User $user): bool
    {
        return $user->hasPermissionTo('reports.sales');
    }
}

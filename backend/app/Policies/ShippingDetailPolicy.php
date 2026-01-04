<?php

namespace App\Policies;

use App\Models\ShippingDetail;
use App\Models\User;

class ShippingDetailPolicy
{
    public function viewAny(User $user)
    {
        // Admin or staff viewing all shipping
        return $user->hasPermissionTo('shipping.view');
    }

    public function view(User $user, ShippingDetail $shippingDetail)
    {
        // User viewing own order's shipping, or staff
        return $user->id === $shippingDetail->order->user_id || $user->hasPermissionTo('shipping.view');
    }

    public function update(User $user, ShippingDetail $shippingDetail)
    {
        return $user->hasPermissionTo('shipping.update');
    }

    public function manageTracking(User $user)
    {
        return $user->hasPermissionTo('shipping.manage-tracking');
    }
}

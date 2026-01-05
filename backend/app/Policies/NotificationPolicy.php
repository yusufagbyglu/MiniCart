<?php

namespace App\Policies;

use App\Models\Notification;
use App\Models\User;

class NotificationPolicy
{
    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('notifications.view-all');
    }

    public function view(User $user, Notification $notification)
    {
        return ($user->id === $notification->user_id && $user->hasPermissionTo('notifications.view-own')) ||
            $user->hasPermissionTo('notifications.view-all');
    }

    public function send(User $user)
    {
        return $user->hasPermissionTo('notifications.send');
    }
}

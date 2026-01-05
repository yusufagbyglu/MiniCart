<?php

namespace App\Policies;

use App\Models\Permission;
use App\Models\User;

class PermissionPolicy
{
    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('permissions.view');
    }

    public function view(User $user, Permission $permission)
    {
        return $user->hasPermissionTo('permissions.view');
    }

    public function assign(User $user)
    {
        return $user->hasPermissionTo('permissions.assign');
    }

    public function create(User $user)
    {
        return $user->hasRole('admin');
    }

    public function update(User $user, Permission $permission)
    {
        return $user->hasRole('admin');
    }

    public function delete(User $user, Permission $permission)
    {
        return $user->hasRole('admin');
    }
}

<?php

namespace App\Policies;

use App\Models\Role;
use App\Models\User;

class RolePolicy
{
    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('roles.view');
    }

    public function view(User $user, Role $role)
    {
        return $user->hasPermissionTo('roles.view');
    }

    public function create(User $user)
    {
        return $user->hasPermissionTo('roles.create');
    }

    public function update(User $user, Role $role)
    {
        return $user->hasPermissionTo('roles.update');
    }

    public function delete(User $user, Role $role)
    {
        return $user->hasPermissionTo('roles.delete');
    }

    public function assign(User $user)
    {
        return $user->hasPermissionTo('roles.assign');
    }
}

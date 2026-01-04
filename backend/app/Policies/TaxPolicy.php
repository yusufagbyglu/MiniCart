<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class TaxPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('taxes.view');
    }

    public function create(User $user)
    {
        return $user->hasPermissionTo('taxes.create');
    }

    public function update(User $user)
    {
        return $user->hasPermissionTo('taxes.update');
    }

    public function delete(User $user)
    {
        return $user->hasPermissionTo('taxes.delete');
    }
}

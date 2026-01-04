<?php

namespace App\Policies;

use App\Models\TaxRate;
use App\Models\User;

class TaxRatePolicy
{
    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('taxes.view');
    }

    public function view(User $user, TaxRate $taxRate)
    {
        return $user->hasPermissionTo('taxes.view');
    }

    public function create(User $user)
    {
        return $user->hasPermissionTo('taxes.create');
    }

    public function update(User $user, TaxRate $taxRate)
    {
        return $user->hasPermissionTo('taxes.update');
    }

    public function delete(User $user, TaxRate $taxRate)
    {
        return $user->hasPermissionTo('taxes.delete');
    }
}

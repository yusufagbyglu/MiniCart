<?php

namespace App\Policies;

use App\Models\StockHistory;
use App\Models\User;

class StockHistoryPolicy
{
    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('stock-history.view');
    }

    public function create(User $user)
    {
        return $user->hasPermissionTo('stock-history.create');
    }
}

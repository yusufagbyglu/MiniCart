<?php

namespace App\Policies;

use App\Models\Payment;
use App\Models\User;

class PaymentPolicy
{
    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('payments.view'); // Admin view all
    }

    public function view(User $user, Payment $payment)
    {
        return $user->id === $payment->order->user_id || $user->hasPermissionTo('payments.view');
    }

    public function process(User $user, Payment $payment)
    {
        return $user->hasPermissionTo('payments.process'); // Admin manual process?
    }

    public function refund(User $user, Payment $payment)
    {
        return $user->hasPermissionTo('payments.refund');
    }
}

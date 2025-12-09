<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;

class UserController extends Controller
{
    public function assignRole(User $user, Role $role)
    {
        $user->roles()->attach($role);

        return response()->json(['message' => 'Role assigned successfully.']);
    }

    public function removeRole(User $user, Role $role)
    {
        $user->roles()->detach($role);

        return response()->json(['message' => 'Role removed successfully.']);
    }
}
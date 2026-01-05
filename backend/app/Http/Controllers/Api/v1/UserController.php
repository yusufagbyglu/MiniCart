<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Auth\Middleware\Authorize;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;


class UserController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', User::class);

        return response()->json(User::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(\App\Http\Requests\StoreUserRequest $request)
    {
        $this->authorize('create', User::class);
        $user = User::create($request->validated());
        return response()->json($user, 201);
    }

    public function assignRole(User $user, Role $role)
    {
        $this->authorize('assign', Role::class);
        $user->roles()->attach($role);

        return response()->json(['message' => 'Role assigned successfully.']);
    }

    public function removeRole(User $user, Role $role)
    {
        $this->authorize('assign', Role::class);
        $user->roles()->detach($role);

        return response()->json(['message' => 'Role removed successfully.']);
    }
}
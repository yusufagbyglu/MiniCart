<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use App\Data\UserData;
use Illuminate\Support\Facades\Hash;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class UserController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        $this->authorize('viewAny', User::class);
        return response()->json(User::with('roles')->paginate(15));
    }

    public function store(UserData $data)
    {
        $this->authorize('create', User::class);
        $user = User::create([
            'name' => $data->name,
            'email' => $data->email,
            'password' => Hash::make($data->password),
        ]);
        return response()->json($user, 201);
    }

    public function show(User $user)
    {
        $this->authorize('view', $user);
        return response()->json($user->load('roles'));
    }

    public function update(UserData $data, User $user)
    {
        $this->authorize('update', $user);

        $attributes = array_filter($data->toArray());

        if (isset($attributes['password']) && !empty($attributes['password'])) {
            $attributes['password'] = Hash::make($attributes['password']);
        } else {
            unset($attributes['password']);
        }

        $user->update($attributes);

        return response()->json($user);
    }

    public function destroy(User $user)
    {
        $this->authorize('delete', $user);
        $user->delete();
        return response()->json(null, 204);
    }

    public function assignRole(User $user, Role $role)
    {
        $this->authorize('assign', Role::class);
        $user->roles()->syncWithoutDetaching([$role->id]);

        return response()->json(['message' => 'Role assigned successfully.']);
    }

    public function removeRole(User $user, Role $role)
    {
        $this->authorize('assign', Role::class);
        $user->roles()->detach($role->id);

        return response()->json(['message' => 'Role removed successfully.']);
    }
}
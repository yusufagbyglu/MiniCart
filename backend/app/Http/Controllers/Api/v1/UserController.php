<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use App\Data\UserData;
use Illuminate\Support\Facades\Hash;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;

class UserController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', User::class);

        $query = User::with('roles');

        // Search by name or email
        $query->when($request->query('search'), function ($query, $search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        });

        // Filter by role
        $query->when($request->query('role'), function ($query, $role) {
            $query->whereHas('roles', function ($rq) use ($role) {
                $rq->where('slug', $role);
            });
        });

        // Filter by registration date
        $query->when($request->query('start_date'), function ($query, $startDate) {
            $query->whereDate('created_at', '>=', $startDate);
        });
        $query->when($request->query('end_date'), function ($query, $endDate) {
            $query->whereDate('created_at', '<=', $endDate);
        });

        // Sorting
        $sortField = $request->query('sort', 'created_at');
        $sortDirection = $request->query('order', 'desc');

        $allowedSortFields = ['name', 'email', 'created_at'];
        if (in_array($sortField, $allowedSortFields)) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $perPage = $request->query('per_page', 15);

        return UserResource::collection($query->paginate($perPage));
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
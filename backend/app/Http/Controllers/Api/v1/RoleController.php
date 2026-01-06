<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\Response;
use App\Data\RoleData;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', Role::class);
        return response()->json(Role::with('permissions')->paginate(20));
    }

    public function store(RoleData $data)
    {
        $this->authorize('create', Role::class);
        $role = Role::create($data->toArray());

        return response()->json($role, Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(Role $role)
    {
        $this->authorize('view', $role);
        return response()->json($role->load('permissions'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(RoleData $data, Role $role)
    {
        $this->authorize('update', $role);
        $role->update($data->toArray());

        return response()->json($role);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        $this->authorize('delete', $role);
        $role->delete();

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }

    public function assignPermission(Role $role, Permission $permission)
    {
        $this->authorize('assign', Permission::class);
        $role->permissions()->attach($permission);

        return response()->json(['message' => 'Permission assigned successfully.']);
    }

    public function removePermission(Role $role, Permission $permission)
    {
        $this->authorize('assign', Permission::class);
        $role->permissions()->detach($permission);

        return response()->json(['message' => 'Permission removed successfully.']);
    }
}

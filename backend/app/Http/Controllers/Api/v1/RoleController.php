<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', Role::class);
        return Role::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Role::class);
        $request->validate([
            'name' => 'required|string|unique:roles,name',
            'description' => 'nullable|string',
        ]);

        $role = Role::create($request->all());

        return response()->json($role, Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(Role $role)
    {
        $this->authorize('view', $role);
        return $role;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Role $role)
    {
        $this->authorize('update', $role);
        $request->validate([
            'name' => 'sometimes|required|string|unique:roles,name,' . $role->id,
            'description' => 'nullable|string',
        ]);

        $role->update($request->all());

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

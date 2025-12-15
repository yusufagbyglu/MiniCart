<?php

namespace App\Traits;

use App\Models\Role;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

trait HasPermission
{
    /**
    * The roles that belong to the user.
    */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'user_roles')->withTimestamps();
    }

    /**
   * Check if the user has a specific permission through their roles.
   *
   * @param string $permissionName The name of the permission.
   * @return bool
   */
    public function hasPermissionTo(string $permissionName): bool
    {
        foreach ($this->roles as $role) {
            if ($role->permissions()->where('name', $permissionName)->exists()) {
                return true;
            }
        }
        return false;
    }

    public function hasRole(string ...$roleNames): bool
    {
        foreach ($roleNames as $roleName) {
            if ($this->roles()->contains('name', $roleName)) {
                return true;
            }
            
        }

        return false;
    }
}
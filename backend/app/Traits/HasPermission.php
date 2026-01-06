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
     * Admin role has implicit permission to everything.
     */
    public function hasPermissionTo(string $permissionName): bool
    {
        // Admin bypass
        if ($this->hasRole('admin')) {
            return true;
        }

        return $this->roles()->whereHas('permissions', function ($q) use ($permissionName) {
            $q->where('name', $permissionName);
        })->exists();
    }

    public function hasRole(string ...$roleNames): bool
    {
        return $this->roles()->whereIn('name', $roleNames)->exists();
    }
}
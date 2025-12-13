<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get roles
        $superAdminRole = Role::where('name', 'admin')->first();
        $shopManagerRole = Role::where('name', 'shop-manager')->first();
        $customerRole = Role::where('name', 'customer')->first();
        $supportRole = Role::where('name', 'support')->first();

        // Get permissions (assuming they were created by PermissionsSeeder)
        $viewUsersPermission = Permission::where('name', 'view_users')->first();
        $createUsersPermission = Permission::where('name', 'create_users')->first();
        $updateUsersPermission = Permission::where('name', 'update_users')->first();
        $deleteUsersPermission = Permission::where('name', 'delete_users')->first();
        $restoreUsersPermission = Permission::where('name', 'restore_users')->first();
        $forceDeleteUsersPermission = Permission::where('name', 'force_delete_users')->first();

        $viewProductsPermission = Permission::where('name', 'view_products')->first();

        if ($superAdminRole) {
            $superAdminRole->permissions()->syncWithoutDetaching(array_filter([
            $viewUsersPermission?->id,
            $createUsersPermission?->id,
            $updateUsersPermission?->id,
            $deleteUsersPermission?->id,
            $restoreUsersPermission?->id,
            $forceDeleteUsersPermission?->id,
        ]));
}

        if ($shopManagerRole) {
            $shopManagerRole->permissions()->syncWithoutDetaching(array_filter([
            $viewUsersPermission?->id,
            $createUsersPermission?->id,
            ]));
        }

        if ($customerRole) {
            $customerRole->permissions()->syncWithoutDetaching(array_filter([
            $viewProductsPermission?->id,
        ]));
        }

        if ($supportRole) {
            $supportRole->permissions()->syncWithoutDetaching(array_filter([
            $viewUsersPermission?->id,
            $updateUsersPermission?->id,
        ]));
        }

        // Customer role generally has no direct permissions on other users
        // Permissions for self-management are often handled implicitly or through other means.
    }
}

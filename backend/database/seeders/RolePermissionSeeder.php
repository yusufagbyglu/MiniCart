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
        $superAdminRole = Role::where('name', 'Super Admin')->first();
        $shopManagerRole = Role::where('name', 'Shop Manager')->first();
        $customerRole = Role::where('name', 'Customer')->first(); // Ensure this role exists

        // Get permissions (assuming they were created by PermissionsSeeder)
        $viewUsersPermission = Permission::where('name', 'view_users')->first();
        $createUsersPermission = Permission::where('name', 'create_users')->first();
        $updateUsersPermission = Permission::where('name', 'update_users')->first();
        $deleteUsersPermission = Permission::where('name', 'delete_users')->first();
        $restoreUsersPermission = Permission::where('name', 'restore_users')->first();
        $forceDeleteUsersPermission = Permission::where('name', 'force_delete_users')->first();

        // Assign permissions to Super Admin
        if ($superAdminRole) {
            $superAdminRole->permissions()->syncWithoutDetaching([
                $viewUsersPermission->id,
                $createUsersPermission->id,
                $updateUsersPermission->id,
                $deleteUsersPermission->id,
                $restoreUsersPermission->id,
                $forceDeleteUsersPermission->id,
            ]);
        }

        // Assign permissions to Shop Manager (example, adjust as needed)
        if ($shopManagerRole) {
            $shopManagerRole->permissions()->syncWithoutDetaching([
                $viewUsersPermission->id, // Shop Manager might need to view users
                $createUsersPermission->id, // Maybe they can create new users
            ]);
        }

        // Customer role generally has no direct permissions on other users
        // Permissions for self-management are often handled implicitly or through other means.
    }
}

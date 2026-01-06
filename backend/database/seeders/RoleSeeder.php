<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;
use App\Models\Role;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();

        // Create roles using the Role model (avoiding duplicates with firstOrCreate)
        $rolesData = [
            ['name' => 'admin', 'description' => 'Full system administrator with all permissions'],
            ['name' => 'shop-manager', 'description' => 'Manages products, orders, and inventory'],
            ['name' => 'support', 'description' => 'Customer support representative'],
            ['name' => 'customer', 'description' => 'Regular customer with shopping permissions'],
        ];

        $roles = [];
        foreach ($rolesData as $roleData) {
            $roles[] = Role::firstOrCreate(
                ['name' => $roleData['name']],
                ['description' => $roleData['description']]
            );
        }

        // Map roles by name for easy access
        $rolesMap = collect($roles)->keyBy('name');

        // Retrieve all permissions from the database
        $allPermissions = DB::table('permissions')->pluck('id', 'name')->toArray();

        // Prepare role-permission assignments
        $rolePermissions = [];

        // Assign all permissions to Admin
        // NOTE: In practice, Admin users are granted full access via middleware, checking the role or Gate,
        // so adding permissions here is mostly symbolic for reference.
        foreach ($allPermissions as $permissionId) {
            $rolePermissions[] = [
                'role_id' => $rolesMap['admin']->id,
                'permission_id' => $permissionId,
                'created_at' => $now,
            ];
        }

        // Assign specific permissions to Shop Manager
        $shopManagerPerms = $this->getPermissionIds($allPermissions, [
            'categories.view',
            'categories.create',
            'categories.update',
            'categories.delete',
            'products.view',
            'products.view-all',
            'products.create',
            'products.update',
            'products.delete',
            'products.manage-stock',
            'products.manage-images',
            'products.set-featured',
            'products.restore',
            'users.view',
            'taxes.view',
            'taxes.create',
            'taxes.update',
            'orders.view-all',
            'orders.update',
            'orders.change-status',
            'orders.cancel',
            'payments.view',
            'payments.process',
            'shipping.view',
            'shipping.update',
            'shipping.manage-tracking',
            'coupons.view',
            'coupons.create',
            'coupons.update',
            'coupons.delete',
            'reviews.view',
            'reviews.approve',
            'reviews.delete-all',
            'stock-history.view',
            'stock-history.create',
            'reports.sales',
            'reports.products',
            'reports.customers',
            'reports.export',
            'cart.view-all',
        ]);

        foreach ($shopManagerPerms as $permissionId) {
            $rolePermissions[] = [
                'role_id' => $rolesMap['shop-manager']->id,
                'permission_id' => $permissionId,
                'created_at' => $now,
            ];
        }

        // Assign specific permissions to Support
        $supportPerms = $this->getPermissionIds($allPermissions, [
            'users.view',
            'categories.view',
            'products.view',
            'products.view-all',
            'orders.view-all',
            'orders.update',
            'orders.change-status',
            'orders.cancel',
            'payments.view',
            'shipping.view',
            'shipping.update',
            'shipping.manage-tracking',
            'reviews.view',
            'reviews.approve',
            'reviews.delete-all',
            'addresses.view-all',
            'notifications.send',
            'notifications.view-all',
            'audit-logs.view',
        ]);

        foreach ($supportPerms as $permissionId) {
            $rolePermissions[] = [
                'role_id' => $rolesMap['support']->id,
                'permission_id' => $permissionId,
                'created_at' => $now,
            ];
        }

        // Assign specific permissions to Customer
        $customerPerms = $this->getPermissionIds($allPermissions, [
            'products.view',
            'categories.view',
            'orders.view-own',
            'orders.create',
            'orders.cancel',
            'cart.manage-own',
            'cart.create',
            'cart-items.add',
            'cart-items.remove',
            'cart-items.update',
            'cart-items.view',
            'reviews.create',
            'reviews.update-own',
            'reviews.delete-own',
            'wishlist.manage-own',
            'addresses.manage-own',
            'notifications.view-own',
            'coupons.apply',
        ]);

        foreach ($customerPerms as $permissionId) {
            $rolePermissions[] = [
                'role_id' => $rolesMap['customer']->id,
                'permission_id' => $permissionId,
                'created_at' => $now,
            ];
        }

        // Insert all role-permission relationships at once
        DB::table('role_permissions')->insert($rolePermissions);

        $this->command->info('Roles and role permissions seeded successfully!');
    }

    /**
     * Get permission IDs from permission names
     */
    private function getPermissionIds(array $allPermissions, array $permissionNames): array
    {
        return array_filter(array_map(fn($name) => $allPermissions[$name] ?? null, $permissionNames));
    }
}

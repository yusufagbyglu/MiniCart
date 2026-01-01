<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();

        $permissions = [
            // User Management
            ['name' => 'users.view', 'description' => 'View users list and details'],
            ['name' => 'users.create', 'description' => 'Create new users'],
            ['name' => 'users.update', 'description' => 'Update user information'],
            ['name' => 'users.delete', 'description' => 'Delete users'],
            ['name' => 'users.restore', 'description' => 'Restore soft-deleted users'],
            ['name' => 'users.force-delete', 'description' => 'Permanently delete users'],
            ['name' => 'users.change-password', 'description' => 'Change user passwords'],
            
            // Role Management
            ['name' => 'roles.view', 'description' => 'View roles list and details'],
            ['name' => 'roles.create', 'description' => 'Create new roles'],
            ['name' => 'roles.update', 'description' => 'Update role information'],
            ['name' => 'roles.delete', 'description' => 'Delete roles'],
            ['name' => 'roles.assign', 'description' => 'Assign roles to users'],
            
            // Permission Management
            ['name' => 'permissions.view', 'description' => 'View permissions list'],
            ['name' => 'permissions.assign', 'description' => 'Assign permissions to roles'],
            
            // Category Management
            ['name' => 'categories.view', 'description' => 'View categories list and details'],
            ['name' => 'categories.create', 'description' => 'Create new categories'],
            ['name' => 'categories.update', 'description' => 'Update category information'],
            ['name' => 'categories.delete', 'description' => 'Delete categories'],
            ['name' => 'categories.restore', 'description' => 'Restore soft-deleted categories'],
            
            // Product Management
            ['name' => 'products.view', 'description' => 'View products list and details'],
            ['name' => 'products.view-all', 'description' => 'View all products including inactive'],
            ['name' => 'products.create', 'description' => 'Create new products'],
            ['name' => 'products.update', 'description' => 'Update product information'],
            ['name' => 'products.delete', 'description' => 'Delete products'],
            ['name' => 'products.restore', 'description' => 'Restore soft-deleted products'],
            ['name' => 'products.force-delete', 'description' => 'Permanently delete products'],
            ['name' => 'products.manage-stock', 'description' => 'Manage product stock levels'],
            ['name' => 'products.manage-images', 'description' => 'Manage product images'],
            ['name' => 'products.set-featured', 'description' => 'Set products as featured'],
            
            // Tax Management
            ['name' => 'taxes.view', 'description' => 'View tax classes, rates, and rules'],
            ['name' => 'taxes.create', 'description' => 'Create tax classes, rates, and rules'],
            ['name' => 'taxes.update', 'description' => 'Update tax information'],
            ['name' => 'taxes.delete', 'description' => 'Delete tax configurations'],
            
            // Order Management
            ['name' => 'orders.view-own', 'description' => 'View own orders'],
            ['name' => 'orders.view-all', 'description' => 'View all orders'],
            ['name' => 'orders.create', 'description' => 'Create new orders'],
            ['name' => 'orders.update', 'description' => 'Update order information'],
            ['name' => 'orders.cancel', 'description' => 'Cancel orders'],
            ['name' => 'orders.refund', 'description' => 'Process order refunds'],
            ['name' => 'orders.delete', 'description' => 'Delete orders'],
            ['name' => 'orders.change-status', 'description' => 'Change order status'],
            
            // Payment Management
            ['name' => 'payments.view', 'description' => 'View payment information'],
            ['name' => 'payments.process', 'description' => 'Process payments'],
            ['name' => 'payments.refund', 'description' => 'Process payment refunds'],
            
            // Shipping Management
            ['name' => 'shipping.view', 'description' => 'View shipping details'],
            ['name' => 'shipping.update', 'description' => 'Update shipping information'],
            ['name' => 'shipping.manage-tracking', 'description' => 'Manage tracking numbers'],
            
            // Cart Management
            ['name' => 'cart.manage-own', 'description' => 'Manage own cart'],
            ['name' => 'cart.view-all', 'description' => 'View all user carts'],
            ['name' => 'cart.create', 'description' => 'Create a new cart'],
            ['name' => 'cart.clear', 'description' => 'Clear cart contents'],
            ['name' => 'cart.transfer', 'description' => 'Transfer cart between users'],
            ['name' => 'cart.apply-coupon', 'description' => 'Apply coupons to cart'],

            // Cart Item Management
            ['name' => 'cart-items.add', 'description' => 'Add items to cart'],
            ['name' => 'cart-items.remove', 'description' => 'Remove items from cart'],
            ['name' => 'cart-items.update', 'description' => 'Update item quantity in cart'],
            ['name' => 'cart-items.view', 'description' => 'View items in cart'],

            // Coupon Management
            ['name' => 'coupons.view', 'description' => 'View coupons list and details'],
            ['name' => 'coupons.create', 'description' => 'Create new coupons'],
            ['name' => 'coupons.update', 'description' => 'Update coupon information'],
            ['name' => 'coupons.delete', 'description' => 'Delete coupons'],
            ['name' => 'coupons.apply', 'description' => 'Apply coupons to orders'],
            
            // Review Management
            ['name' => 'reviews.view', 'description' => 'View all reviews'],
            ['name' => 'reviews.create', 'description' => 'Create product reviews'],
            ['name' => 'reviews.update-own', 'description' => 'Update own reviews'],
            ['name' => 'reviews.update-all', 'description' => 'Update any review'],
            ['name' => 'reviews.delete-own', 'description' => 'Delete own reviews'],
            ['name' => 'reviews.delete-all', 'description' => 'Delete any review'],
            ['name' => 'reviews.approve', 'description' => 'Approve or reject reviews'],
            
            // Wishlist Management
            ['name' => 'wishlist.manage-own', 'description' => 'Manage own wishlist'],
            ['name' => 'wishlist.view-all', 'description' => 'View all wishlists'],
            
            // Address Management
            ['name' => 'addresses.manage-own', 'description' => 'Manage own addresses'],
            ['name' => 'addresses.view-all', 'description' => 'View all user addresses'],
            
            // Stock History
            ['name' => 'stock-history.view', 'description' => 'View stock history'],
            ['name' => 'stock-history.create', 'description' => 'Create stock adjustments'],
            
            // Notifications
            ['name' => 'notifications.view-own', 'description' => 'View own notifications'],
            ['name' => 'notifications.send', 'description' => 'Send notifications to users'],
            ['name' => 'notifications.view-all', 'description' => 'View all notifications'],
            
            // Audit Logs
            ['name' => 'audit-logs.view', 'description' => 'View audit logs'],
            
            // Reports & Analytics
            ['name' => 'reports.sales', 'description' => 'View sales reports'],
            ['name' => 'reports.products', 'description' => 'View product reports'],
            ['name' => 'reports.customers', 'description' => 'View customer reports'],
            ['name' => 'reports.export', 'description' => 'Export reports'],
            
            // System Settings
            ['name' => 'settings.view', 'description' => 'View system settings'],
            ['name' => 'settings.update', 'description' => 'Update system settings'],
        ];

        // Add timestamps to all permissions
        $permissions = array_map(function ($permission) use ($now) {
            return array_merge($permission, [
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }, $permissions);

        // Insert permissions
        DB::table('permissions')->insert($permissions);

        $this->command->info('Permissions seeded successfully!');
    }
}
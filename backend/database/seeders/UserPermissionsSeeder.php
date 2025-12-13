<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Permission::create(['name' => 'view_users', 'description' => 'Can view user accounts']);
        Permission::create(['name' => 'create_users', 'description' => 'Can create new user accounts']);
        Permission::create(['name' => 'update_users', 'description' => 'Can update existing user accounts']);
        Permission::create(['name' => 'delete_users', 'description' => 'Can delete user accounts']);
        Permission::create(['name' => 'restore_users', 'description' => 'Can restore soft-deleted user accounts']);
        Permission::create(['name' => 'force_delete_users', 'description' => 'Can permanently delete user accounts']);
    }
}

<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Role::create(['name' => 'admin', 'description' => 'Full access to all system features.']);
        Role::create(['name' => 'shop-manager', 'description' => 'Manages products, orders, and inventory.']);
        Role::create(['name' => 'support', 'description' => 'Assists customers and manages reviews.']);
        Role::create(['name' => 'customer', 'description' => 'Default role for registered users.']);
    }
}

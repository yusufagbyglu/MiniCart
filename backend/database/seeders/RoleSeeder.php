<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            ['name' => 'admin', 'description' => 'Full access to all system features.'],
            ['name' => 'shop-manager', 'description' => 'Manages products, orders, and inventory.'],
            ['name' => 'support', 'description' => 'Assists customers and manages reviews.'],
            ['name' => 'customer', 'description' => 'Default role for registered users.'],
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(
                ['name' => $role['name']], // Bu kriterle var mı diye bak
                ['description' => $role['description']] // Yoksa oluştur
            );
        }
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Permission;

class ProductPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $viewProducts = Permission::firstOrCreate(
            ['name' => 'view_products'],
            ['description' => 'Can view products list']
        );
        $createProducts = Permission::firstOrCreate(
            ['name' => 'create_products'],
            ['description' => 'Can create new products']
        );
        $updateProducts = Permission::firstOrCreate(
            ['name' => 'update_products'],
            ['description' => 'Can update existing products']
        );
        $deleteProducts = Permission::firstOrCreate(
            ['name' => 'delete_products'],
            ['description' => 'Can delete products']
        );
    }
}

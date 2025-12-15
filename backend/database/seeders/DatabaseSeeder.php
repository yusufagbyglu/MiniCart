<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role;


class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserPermissionsSeeder::class,
            ProductPermissionSeeder::class,
            // OrderPermissionSeeder::class,
            // CategoryPermissionSeeder::class,

            RoleSeeder::class,
            RolePermissionSeeder::class,
        ]);
        


    }
}

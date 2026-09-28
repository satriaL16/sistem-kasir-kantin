<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['username' => 'admin'],
            [
                'nama' => 'Administrator',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
            ],
        );

        User::updateOrCreate(
            ['username' => 'kasir'],
            [
                'nama' => 'Kasir',
                'password' => Hash::make('kasir123'),
                'role' => 'kasir',
            ],
        );
    }
}

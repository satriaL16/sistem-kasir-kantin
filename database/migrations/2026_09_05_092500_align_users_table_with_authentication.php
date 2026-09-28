<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('users')) {
            return;
        }

        if (Schema::hasColumn('users', 'id') && ! Schema::hasColumn('users', 'id_user')) {
            Schema::table('users', function (Blueprint $table): void {
                $table->renameColumn('id', 'id_user');
            });
        }

        if (! Schema::hasColumn('users', 'nama')) {
            Schema::table('users', function (Blueprint $table): void {
                $table->string('nama')->nullable();
            });

            if (Schema::hasColumn('users', 'name')) {
                DB::table('users')->update([
                    'nama' => DB::raw('"name"'),
                ]);
            }
        }

        if (! Schema::hasColumn('users', 'username')) {
            Schema::table('users', function (Blueprint $table): void {
                $table->string('username')->nullable();
            });

            if (Schema::hasColumn('users', 'email')) {
                DB::table('users')->whereNull('username')->update([
                    'username' => DB::raw('"email"'),
                ]);
            }
        }

        if (! Schema::hasColumn('users', 'role')) {
            Schema::table('users', function (Blueprint $table): void {
                $table->string('role')->default('kasir');
            });
        }

        if (Schema::hasColumn('users', 'username')) {
            $users = DB::table('users')->whereNull('username')->get(['id_user']);

            foreach ($users as $user) {
                DB::table('users')->where('id_user', $user->id_user)->update([
                    'username' => 'user_' . $user->id_user,
                ]);
            }
        }
    }

    public function down(): void
    {
        // Keep existing user data when rolling back this compatibility migration.
    }
};

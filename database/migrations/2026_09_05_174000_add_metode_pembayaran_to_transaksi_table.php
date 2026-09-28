<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('transaksi', 'metode_pembayaran')) {
            Schema::table('transaksi', function (Blueprint $table): void {
                $table->string('metode_pembayaran')->default('tunai')->after('kembalian');
            });
        }
    }

    public function down(): void
    {
        Schema::table('transaksi', function (Blueprint $table): void {
            $table->dropColumn('metode_pembayaran');
        });
    }
};

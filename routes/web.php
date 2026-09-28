<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\ProdukController;
use App\Http\Controllers\TransaksiController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/login');
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
// Routes untuk Register
Route::get('/register', [UserController::class, 'showRegister'])->name('register');
Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::middleware('auth')->group(function () {
    // Akses Kasir & Admin
    Route::get('/kasir', [TransaksiController::class, 'index'])->name('kasir.index');
    Route::post('/transaksi', [TransaksiController::class, 'store'])->name('transaksi.store');
    Route::get('/transaksi/riwayat', [TransaksiController::class, 'history'])->name('transaksi.history');

    // Khusus Admin
    Route::middleware('can:admin-access')->group(function () {
        Route::get('/admin', [AdminController::class, 'dashboard'])->name('admin.dashboard');
        Route::get('/admin/laporan', [AdminController::class, 'report'])->name('admin.report');
        Route::get('/admin/laporan/export-excel', [AdminController::class, 'exportExcel'])->name('admin.report.excel');
        Route::resource('/admin/produk', ProdukController::class)->except(['create', 'show', 'edit']);

        // ... dalam grup middleware auth untuk admin ...
        Route::resource('/admin/kategori', KategoriController::class)->except(['create', 'show', 'edit']);
        Route::resource('/admin/users', UserController::class)->except(['create', 'show', 'edit']);
    });
});

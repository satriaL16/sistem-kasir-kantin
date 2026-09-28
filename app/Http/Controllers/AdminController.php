<?php

namespace App\Http\Controllers;

use App\Models\DetailTransaksi;
use App\Models\Produk;
use App\Models\Transaksi;
use Illuminate\Support\Carbon;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function dashboard()
    {
        $today = Carbon::today();

        $topProducts = DetailTransaksi::query()
            ->select('id_produk')
            ->selectRaw('SUM(jumlah) as total_terjual')
            ->with('produk:id_produk,nama_produk')
            ->groupBy('id_produk')
            ->orderByDesc('total_terjual')
            ->limit(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_transaksi' => Transaksi::count(),
                'transaksi_hari_ini' => Transaksi::whereDate('tanggal', $today)->count(),
                'omzet' => (float) Transaksi::sum('total'),
                'omzet_hari_ini' => (float) Transaksi::whereDate('tanggal', $today)->sum('total'),
                'stok_menipis' => Produk::where('stok', '>', 0)->where('stok', '<=', 5)->count(),
            ],
            'topProducts' => $topProducts,
            'salesChart' => Transaksi::query()
                ->selectRaw('DATE(tanggal) as tanggal')
                ->selectRaw('SUM(total) as omzet')
                ->selectRaw('COUNT(*) as jumlah_transaksi')
                ->whereDate('tanggal', '>=', $today->copy()->subDays(6))
                ->groupByRaw('DATE(tanggal)')
                ->orderBy('tanggal')
                ->get(),
            'recentTransactions' => Transaksi::with('user')
                ->latest('tanggal')
                ->limit(6)
                ->get(),
            'topCashiers' => Transaksi::query()
                ->select('id_user')
                ->selectRaw('COUNT(*) as jumlah_transaksi')
                ->selectRaw('SUM(total) as omzet')
                ->with('user:id_user,nama,username')
                ->groupBy('id_user')
                ->orderByDesc('omzet')
                ->limit(5)
                ->get(),
            'lowStockProducts' => Produk::with('kategori')
                ->where('stok', '>', 0)
                ->where('stok', '<=', 5)
                ->orderBy('stok')
                ->limit(10)
                ->get(),
        ]);
    }

    public function report(Request $request)
    {
        $validated = $request->validate([
            'mulai' => ['nullable', 'date'],
            'sampai' => ['nullable', 'date', 'after_or_equal:mulai'],
        ]);

        $mulai = $validated['mulai'] ?? now()->startOfMonth()->toDateString();
        $sampai = $validated['sampai'] ?? now()->toDateString();

        $transaksi = Transaksi::with('user')
            ->whereBetween('tanggal', [
                Carbon::parse($mulai)->startOfDay(),
                Carbon::parse($sampai)->endOfDay(),
            ])
            ->latest('tanggal')
            ->get();

        $topProducts = DetailTransaksi::query()
            ->select('id_produk')
            ->selectRaw('SUM(jumlah) as total_terjual')
            ->selectRaw('SUM(subtotal) as total_penjualan')
            ->whereHas('transaksi', function ($query) use ($mulai, $sampai) {
                $query->whereBetween('tanggal', [
                    Carbon::parse($mulai)->startOfDay(),
                    Carbon::parse($sampai)->endOfDay(),
                ]);
            })
            ->with('produk:id_produk,nama_produk')
            ->groupBy('id_produk')
            ->orderByDesc('total_penjualan')
            ->limit(10)
            ->get();

        return Inertia::render('Admin/Laporan', [
            'filters' => ['mulai' => $mulai, 'sampai' => $sampai],
            'summary' => [
                'jumlah_transaksi' => $transaksi->count(),
                'omzet' => (float) $transaksi->sum('total'),
                'rata_rata' => $transaksi->count() > 0
                    ? (float) $transaksi->avg('total')
                    : 0,
            ],
            'transaksi' => $transaksi,
            'topProducts' => $topProducts,
        ]);
    }

    public function exportExcel(Request $request): StreamedResponse
    {
        $validated = $request->validate([
            'mulai' => ['nullable', 'date'],
            'sampai' => ['nullable', 'date', 'after_or_equal:mulai'],
        ]);

        $mulai = $validated['mulai'] ?? now()->startOfMonth()->toDateString();
        $sampai = $validated['sampai'] ?? now()->toDateString();
        $transaksi = Transaksi::with('user')
            ->whereBetween('tanggal', [
                Carbon::parse($mulai)->startOfDay(),
                Carbon::parse($sampai)->endOfDay(),
            ])
            ->latest('tanggal')
            ->get();

        return response()->streamDownload(function () use ($transaksi, $mulai, $sampai): void {
            $output = fopen('php://output', 'w');
            fwrite($output, "\xEF\xBB\xBF");
            fputcsv($output, ['Laporan Penjualan', "Periode: {$mulai} s/d {$sampai}"]);
            fputcsv($output, []);
            fputcsv($output, ['No Transaksi', 'Tanggal', 'Kasir', 'Total', 'Uang Bayar', 'Kembalian']);

            foreach ($transaksi as $item) {
                fputcsv($output, [
                    $item->id_transaksi,
                    $item->tanggal,
                    $item->user?->nama ?? 'Kasir',
                    $item->total,
                    $item->uang_bayar,
                    $item->kembalian,
                ]);
            }

            fclose($output);
        }, "laporan-penjualan-{$mulai}-{$sampai}.csv", [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }
}

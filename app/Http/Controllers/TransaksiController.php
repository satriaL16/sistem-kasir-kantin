<?php

namespace App\Http\Controllers;

use App\Models\Produk;
use App\Models\Transaksi;
use App\Models\DetailTransaksi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class TransaksiController extends Controller {
    public function index() {
        $produk = Produk::with('kategori')->where('status', 'tersedia')->where('stok', '>', 0)->get();
        return Inertia::render('Kasir/Index', [
            'produk' => $produk,
            'kategori' => $produk->pluck('kategori')->filter()->unique('id_kategori')->values(),
            'lowStockProducts' => Produk::where('stok', '>', 0)
                ->where('stok', '<=', 5)
                ->orderBy('stok')
                ->limit(5)
                ->get(['id_produk', 'nama_produk', 'stok']),
        ]);
    }

    public function history()
    {
        $query = Transaksi::with(['user', 'detailTransaksi.produk'])
            ->latest('tanggal');

        if (auth()->user()->role !== 'admin') {
            $query->where('id_user', auth()->id());
        }

        return Inertia::render('Kasir/Riwayat', [
            'transaksi' => $query->get(),
        ]);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'cart' => 'required|array',
            'cart.*.id_produk' => 'required|integer|exists:produk,id_produk',
            'cart.*.jumlah' => 'required|integer|min:1',
            'uang_bayar' => 'required|numeric|min:0',
            'metode_pembayaran' => 'required|in:tunai,qris,transfer',
        ]);

        $transaksi = DB::transaction(function () use ($validated) {
            $items = collect($validated['cart'])
                ->groupBy('id_produk')
                ->map(fn ($productItems, $id) => [
                    'id_produk' => (int) $id,
                    'jumlah' => $productItems->sum('jumlah'),
                ])
                ->values();
            $total = 0;
            $details = [];

            foreach ($items as $item) {
                $produk = Produk::whereKey($item['id_produk'])->lockForUpdate()->first();

                if (! $produk || $produk->status !== 'tersedia' || $produk->stok < $item['jumlah']) {
                    throw ValidationException::withMessages([
                        'cart' => "Stok produk {$produk?->nama_produk} tidak mencukupi atau sudah habis.",
                    ]);
                }

                $subtotal = (float) $produk->harga * $item['jumlah'];
                $total += $subtotal;
                $details[] = [
                    'produk' => $produk,
                    'jumlah' => $item['jumlah'],
                    'harga' => $produk->harga,
                    'subtotal' => $subtotal,
                ];
            }

            if ((float) $validated['uang_bayar'] < $total) {
                throw ValidationException::withMessages([
                    'uang_bayar' => 'Uang bayar kurang dari total belanja.',
                ]);
            }

            $transaksi = Transaksi::create([
                'id_user' => auth()->id(),
                'tanggal' => now(),
                'total' => $total,
                'uang_bayar' => $validated['uang_bayar'],
                'kembalian' => (float) $validated['uang_bayar'] - $total,
                'metode_pembayaran' => $validated['metode_pembayaran'],
            ]);

            foreach ($details as $detail) {
                DetailTransaksi::create([
                    'id_transaksi' => $transaksi->id_transaksi,
                    'id_produk' => $detail['produk']->id_produk,
                    'jumlah' => $detail['jumlah'],
                    'harga' => $detail['harga'],
                    'subtotal' => $detail['subtotal'],
                ]);

                $remainingStock = $detail['produk']->stok - $detail['jumlah'];
                $detail['produk']->decrement('stok', $detail['jumlah']);
                if ($remainingStock <= 0) {
                    $detail['produk']->update(['status' => 'habis']);
                }
            }

            return $transaksi;
        });

        return redirect()->back()->with('success', "Transaksi #{$transaksi->id_transaksi} berhasil!");
    }
}

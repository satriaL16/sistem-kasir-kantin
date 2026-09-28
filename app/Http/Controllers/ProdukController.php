<?php

namespace App\Http\Controllers;

use App\Models\Produk;
use App\Models\Kategori;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProdukController extends Controller
{
    public function index()
    {
        $produk = Produk::with('kategori')->orderBy('id_produk', 'desc')->get();
        $kategori = Kategori::all(); // Untuk dropdown di modal form produk
        
        return Inertia::render('Admin/Produk/Index', [
            'produk' => $produk,
            'kategori' => $kategori
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_kategori' => 'required|exists:kategori,id_kategori',
            'nama_produk' => 'required|string|max:255',
            'harga' => 'required|numeric|min:0',
            'stok' => 'required|integer|min:0',
            'status' => 'required|in:tersedia,habis'
        ]);

        Produk::create($validated);
        return redirect()->back()->with('success', 'Produk berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $produk = Produk::findOrFail($id);
        
        $validated = $request->validate([
            'id_kategori' => 'required|exists:kategori,id_kategori',
            'nama_produk' => 'required|string|max:255',
            'harga' => 'required|numeric|min:0',
            'stok' => 'required|integer|min:0',
            'status' => 'required|in:tersedia,habis'
        ]);

        $produk->update($validated);
        return redirect()->back()->with('success', 'Produk berhasil diperbarui.');
    }

    public function destroy($id)
    {
        Produk::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Produk berhasil dihapus.');
    }
}
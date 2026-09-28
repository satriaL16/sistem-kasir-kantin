<?php

namespace App\Http\Controllers;

use App\Models\Kategori;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KategoriController extends Controller
{
    public function index()
    {
        $kategori = Kategori::orderBy('id_kategori', 'desc')->get();
        return Inertia::render('Admin/Kategori/Index', [
            'kategori' => $kategori
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_kategori' => 'required|string|max:255|unique:kategori,nama_kategori'
        ]);

        Kategori::create($validated);
        return redirect()->back()->with('success', 'Kategori berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $kategori = Kategori::findOrFail($id);
        
        $validated = $request->validate([
            'nama_kategori' => 'required|string|max:255|unique:kategori,nama_kategori,' . $id . ',id_kategori'
        ]);

        $kategori->update($validated);
        return redirect()->back()->with('success', 'Kategori berhasil diperbarui.');
    }

    public function destroy($id)
    {
        Kategori::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Kategori berhasil dihapus.');
    }
}

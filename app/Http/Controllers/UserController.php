<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::orderBy('id_user', 'desc')->get();
        return Inertia::render('Admin/User/Index', [
            'users' => $users
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,kasir'
        ]);

        // Enkripsi password sebelum disimpan
        $validated['password'] = Hash::make($validated['password']);

        User::create($validated);
        return redirect()->back()->with('success', 'Pengguna berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $rules = [
            'nama' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username,' . $id . ',id_user',
            'role' => 'required|in:admin,kasir'
        ];

        // Validasi password hanya jika diisi (opsional saat edit)
        if ($request->filled('password')) {
            $rules['password'] = 'string|min:6';
        }

        $validated = $request->validate($rules);

        if ($request->filled('password')) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']); // Hapus dari array agar tidak nimpa data lama
        }

        $user->update($validated);
        return redirect()->back()->with('success', 'Pengguna berhasil diperbarui.');
    }

    public function destroy($id)
    {
        // Cegah user menghapus akunnya sendiri yang sedang aktif
        if (auth()->id() == $id) {
            return redirect()->back()->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        User::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Pengguna berhasil dihapus.');
    }

    public function showRegister()
    {
        // Jika sudah login, arahkan ke dashboard
        if (Auth::check()) {
            return auth()->user()->role === 'admin' ? redirect('/admin') : redirect('/kasir');
        }
        return Inertia::render('Auth/Register');
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'nama' => $validated['nama'],
            'username' => $validated['username'],
            'password' => Hash::make($validated['password']),
            'role' => 'kasir', // Default akun yang mendaftar adalah kasir
        ]);

        // Langsung login setelah register berhasil
        Auth::login($user);

        return redirect('/kasir');
    }
}
import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import FlashMessage from '../../../Components/FlashMessage';
import AdminSidebar from '../../../Components/AdminSidebar';

export default function Index({ users = [], flash }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    // Inisialisasi form menggunakan useForm Inertia
    const { data, setData, post, put, delete: destroy, reset, errors, processing, clearErrors } = useForm({
        nama: '',
        username: '',
        password: '',
        role: 'kasir',
    });

    // Buka modal untuk Tambah User
    const openAddModal = () => {
        setIsEdit(false);
        setEditId(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    // Buka modal untuk Edit User
    const openEditModal = (item) => {
        setIsEdit(true);
        setEditId(item.id_user);
        setData({
            nama: item.nama,
            username: item.username,
            password: '', // Password dikosongkan saat edit (opsional diisi)
            role: item.role,
        });
        clearErrors();
        setIsModalOpen(true);
    };

    // Tutup modal
    const closeModal = () => {
        setIsModalOpen(false);
        reset();
        clearErrors();
    };

    // Handle Submit Form
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(`/admin/users/${editId}`, {
                onSuccess: () => closeModal(),
            });
        } else {
            post('/admin/users', {
                onSuccess: () => closeModal(),
            });
        }
    };

    // Handle Hapus User
    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
            destroy(`/admin/users/${id}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Kelola Pengguna - Admin Kantin" />
            <FlashMessage flash={flash} />

            <AdminSidebar active="/admin/users" />

            <div className="mx-auto max-w-6xl p-3 pb-24 pt-6 sm:p-6 sm:pt-8 lg:ml-72 lg:pb-6 lg:pt-8">
                <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">Daftar Pengguna</h2>
                            <p className="text-sm text-gray-500">Kelola akun akses untuk Admin dan Kasir.</p>
                        </div>
                        <button 
                            onClick={openAddModal}
                            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 sm:w-auto"
                        >
                            + Tambah Pengguna
                        </button>
                    </div>

                    {/* Tabel Pengguna */}
                    <div className="overflow-x-auto border border-gray-100 rounded-lg">
                        <table className="w-full min-w-[640px] border-collapse text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                                    <th className="p-4 font-semibold w-16 text-center">No</th>
                                    <th className="p-4 font-semibold">Nama Lengkap</th>
                                    <th className="p-4 font-semibold">Username</th>
                                    <th className="p-4 font-semibold">Role</th>
                                    <th className="p-4 font-semibold text-center w-32">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-6 text-center text-gray-500">Belum ada pengguna.</td>
                                    </tr>
                                ) : (
                                    users.map((item, index) => (
                                        <tr key={item.id_user} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                            <td className="p-4 text-center text-gray-500">{index + 1}</td>
                                            <td className="p-4 text-gray-800 font-medium">{item.nama}</td>
                                            <td className="p-4 text-gray-600">{item.username}</td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${
                                                    item.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {item.role}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center space-x-3">
                                                <button 
                                                    onClick={() => openEditModal(item)}
                                                    className="text-amber-500 hover:text-amber-700 font-medium text-sm"
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(item.id_user)}
                                                    className="text-red-500 hover:text-red-700 font-medium text-sm"
                                                >
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Tambah/Edit Pengguna */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal}></div>
                    <div className="relative z-10 max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-xl bg-white p-5 shadow-xl sm:p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            {isEdit ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
                        </h3>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Input Nama */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                                <input
                                    type="text"
                                    value={data.nama}
                                    onChange={e => setData('nama', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Masukkan nama lengkap"
                                    required
                                />
                                {errors.nama && <p className="text-red-500 text-xs mt-1">{errors.nama}</p>}
                            </div>

                            {/* Input Username */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                <input
                                    type="text"
                                    value={data.username}
                                    onChange={e => setData('username', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Masukkan username"
                                    required
                                />
                                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                            </div>

                            {/* Input Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password {isEdit && <span className="text-xs text-gray-400 font-normal">(Kosongkan jika tidak diubah)</span>}
                                </label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder={isEdit ? '••••••••' : 'Minimal 6 karakter'}
                                    {...(!isEdit && { required: true })}
                                />
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </div>

                            {/* Pilihan Role */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role / Hak Akses</label>
                                <select
                                    value={data.role}
                                    onChange={e => setData('role', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                >
                                    <option value="kasir">Kasir</option>
                                    <option value="admin">Admin</option>
                                </select>
                                {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
                            </div>

                            {/* Tombol Aksi */}
                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
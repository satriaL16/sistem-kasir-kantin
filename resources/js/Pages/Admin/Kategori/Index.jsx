import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import FlashMessage from '../../../Components/FlashMessage';
import AdminSidebar from '../../../Components/AdminSidebar';

export default function Index({ kategori = [], flash }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    // Inisialisasi form
    const { data, setData, post, put, delete: destroy, reset, errors, processing, clearErrors } = useForm({
        nama_kategori: '',
    });

    // Buka modal untuk Tambah
    const openAddModal = () => {
        setIsEdit(false);
        setEditId(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    // Buka modal untuk Edit dan isi form
    const openEditModal = (item) => {
        setIsEdit(true);
        setEditId(item.id_kategori);
        setData({
            nama_kategori: item.nama_kategori,
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

    // Handle form submit (Tambah / Edit)
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(`/admin/kategori/${editId}`, {
                onSuccess: () => closeModal(),
            });
        } else {
            post('/admin/kategori', {
                onSuccess: () => closeModal(),
            });
        }
    };

    // Handle hapus kategori
    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus kategori ini? Semua produk dalam kategori ini juga akan terhapus.')) {
            destroy(`/admin/kategori/${id}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Kelola Kategori - Admin Kantin" />
            <FlashMessage flash={flash} />

            <AdminSidebar active="/admin/kategori" />

            <div className="mx-auto max-w-4xl p-3 pb-24 pt-6 sm:p-6 sm:pt-8 lg:ml-72 lg:pb-6 lg:pt-8">
                <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">Daftar Kategori</h2>
                            <p className="text-sm text-gray-500">Kelola kategori menu (contoh: Makanan Berat, Minuman, Snack).</p>
                        </div>
                        <button 
                            onClick={openAddModal}
                            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 sm:w-auto"
                        >
                            + Tambah Kategori
                        </button>
                    </div>

                    {/* Tabel Kategori */}
                    <div className="overflow-x-auto border border-gray-100 rounded-lg">
                        <table className="w-full min-w-[480px] border-collapse text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                                    <th className="p-4 font-semibold w-16 text-center">No</th>
                                    <th className="p-4 font-semibold">Nama Kategori</th>
                                    <th className="p-4 font-semibold text-center w-32">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {kategori.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="p-6 text-center text-gray-500">Belum ada kategori.</td>
                                    </tr>
                                ) : (
                                    kategori.map((item, index) => (
                                        <tr key={item.id_kategori} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                            <td className="p-4 text-center text-gray-500">{index + 1}</td>
                                            <td className="p-4 text-gray-800 font-medium">{item.nama_kategori}</td>
                                            <td className="p-4 text-center space-x-3">
                                                <button 
                                                    onClick={() => openEditModal(item)}
                                                    className="text-amber-500 hover:text-amber-700 font-medium text-sm"
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(item.id_kategori)}
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

            {/* Modal Tambah/Edit Kategori */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal}></div>
                    <div className="relative z-10 w-full max-w-sm rounded-xl bg-white p-5 shadow-xl sm:p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            {isEdit ? 'Edit Kategori' : 'Tambah Kategori'}
                        </h3>
                        
                        <form onSubmit={handleSubmit}>
                            {/* Input Nama Kategori */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kategori</label>
                                <input
                                    type="text"
                                    value={data.nama_kategori}
                                    onChange={e => setData('nama_kategori', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Masukkan nama kategori"
                                    autoFocus
                                />
                                {errors.nama_kategori && <p className="text-red-500 text-xs mt-1">{errors.nama_kategori}</p>}
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
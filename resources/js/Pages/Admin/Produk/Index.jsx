import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import FlashMessage from '../../../Components/FlashMessage';
import AdminSidebar from '../../../Components/AdminSidebar';

export default function Index({ produk = [], kategori = [], flash }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    // Inisialisasi form
    const { data, setData, post, put, delete: destroy, reset, errors, processing, clearErrors } = useForm({
        id_kategori: '',
        nama_produk: '',
        harga: '',
        stok: '',
        status: 'tersedia',
    });

    // Buka modal untuk Tambah
    const openAddModal = () => {
        setIsEdit(false);
        setEditId(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    // Buka modal untuk Edit dan isi form dengan data produk yang dipilih
    const openEditModal = (item) => {
        setIsEdit(true);
        setEditId(item.id_produk);
        setData({
            id_kategori: item.id_kategori,
            nama_produk: item.nama_produk,
            harga: item.harga,
            stok: item.stok,
            status: item.status,
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
            put(`/admin/produk/${editId}`, {
                onSuccess: () => closeModal(),
            });
        } else {
            post('/admin/produk', {
                onSuccess: () => closeModal(),
            });
        }
    };

    // Handle hapus produk
    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
            destroy(`/admin/produk/${id}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Kelola Produk - Admin Kantin" />
            <FlashMessage flash={flash} />

            <AdminSidebar active="/admin/produk" />

            <div className="mx-auto max-w-7xl p-3 pb-24 pt-6 sm:p-6 sm:pt-8 lg:ml-72 lg:pb-6 lg:pt-8">
                <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">Daftar Produk</h2>
                            <p className="text-sm text-gray-500">Kelola menu makanan dan minuman kantin.</p>
                        </div>
                        <button 
                            onClick={openAddModal}
                            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 sm:w-auto"
                        >
                            + Tambah Produk
                        </button>
                    </div>

                    {/* Tabel Produk */}
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px] border-collapse text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                                    <th className="p-4 font-semibold">Nama Produk</th>
                                    <th className="p-4 font-semibold">Kategori</th>
                                    <th className="p-4 font-semibold">Harga</th>
                                    <th className="p-4 font-semibold">Stok</th>
                                    <th className="p-4 font-semibold">Status</th>
                                    <th className="p-4 font-semibold text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {produk.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="p-6 text-center text-gray-500">Belum ada produk.</td>
                                    </tr>
                                ) : (
                                    produk.map((item) => (
                                        <tr key={item.id_produk} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                            <td className="p-4 text-gray-800 font-medium">{item.nama_produk}</td>
                                            <td className="p-4 text-gray-600">{item.kategori?.nama_kategori}</td>
                                            <td className="p-4 text-gray-600">Rp {parseInt(item.harga).toLocaleString('id-ID')}</td>
                                            <td className="p-4 text-gray-600">{item.stok}</td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    item.status === 'tersedia' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center space-x-2">
                                                <button 
                                                    onClick={() => openEditModal(item)}
                                                    className="text-amber-500 hover:text-amber-700 font-medium text-sm"
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(item.id_produk)}
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

            {/* Modal Tambah/Edit Produk */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={closeModal}></div>
                    <div className="relative z-10 max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-xl bg-white p-5 shadow-xl sm:p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            {isEdit ? 'Edit Produk' : 'Tambah Produk Baru'}
                        </h3>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Input Nama Produk */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
                                <input
                                    type="text"
                                    required
                                    value={data.nama_produk}
                                    onChange={e => setData('nama_produk', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.nama_produk && <p className="text-red-500 text-xs mt-1">{errors.nama_produk}</p>}
                            </div>

                            {/* Pilihan Kategori */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                <select
                                    value={data.id_kategori}
                                    required
                                    onChange={e => setData('id_kategori', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                >
                                    <option value="">-- Pilih Kategori --</option>
                                    {kategori.length > 0 ? (
                                        kategori.map(kat => (
                                            <option key={kat.id_kategori} value={kat.id_kategori}>{kat.nama_kategori}</option>
                                        ))
                                    ) : (
                                        <option value="" disabled>Belum ada kategori</option>
                                    )}
                                </select>
                                {errors.id_kategori && <p className="text-red-500 text-xs mt-1">{errors.id_kategori}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Input Harga */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        required
                                        value={data.harga}
                                        onChange={e => setData('harga', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.harga && <p className="text-red-500 text-xs mt-1">{errors.harga}</p>}
                                </div>

                                {/* Input Stok */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Stok</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="1"
                                        required
                                        value={data.stok}
                                        onChange={e => setData('stok', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.stok && <p className="text-red-500 text-xs mt-1">{errors.stok}</p>}
                                </div>
                            </div>

                            {/* Input Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={data.status}
                                    onChange={e => setData('status', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                >
                                    <option value="tersedia">Tersedia</option>
                                    <option value="habis">Habis</option>
                                </select>
                                {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
                            </div>

                            {/* Tombol Aksi */}
                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
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
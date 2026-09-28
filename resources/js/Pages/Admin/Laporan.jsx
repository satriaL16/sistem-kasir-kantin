import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminSidebar from '../../Components/AdminSidebar';

const formatCurrency = (value) => `Rp ${Number(value).toLocaleString('id-ID')}`;

export default function Laporan({ filters, summary, transaksi = [], topProducts = [] }) {
    const submit = (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        router.get('/admin/laporan', {
            mulai: form.get('mulai'),
            sampai: form.get('sampai'),
        }, { preserveState: true });
    };

    const exportExcel = () => {
        window.location.href = `/admin/laporan/export-excel?mulai=${filters.mulai}&sampai=${filters.sampai}`;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Laporan Penjualan - Admin Kantin" />
            <div className="print:hidden">
                <AdminSidebar active="/admin/laporan" />
            </div>

            <main className="mx-auto max-w-7xl space-y-5 p-3 pb-24 pt-6 sm:space-y-6 sm:p-6 sm:pt-8 lg:ml-72 lg:pb-6 lg:pt-8">
                <form onSubmit={submit} className="print:hidden flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-end sm:gap-4 sm:p-5">
                    <div className="flex-1 sm:min-w-44">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mulai</label>
                        <input name="mulai" type="date" defaultValue={filters.mulai} className="w-full rounded-lg border px-3 py-2" required />
                    </div>
                    <div className="flex-1 sm:min-w-44">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sampai</label>
                        <input name="sampai" type="date" defaultValue={filters.sampai} className="w-full rounded-lg border px-3 py-2" required />
                    </div>
                    <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Tampilkan</button>
                    <button type="button" onClick={exportExcel} className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700">
                        Export Excel
                    </button>
                    <button type="button" onClick={() => window.print()} className="rounded-lg bg-gray-700 px-4 py-2 text-white hover:bg-gray-800">
                        Cetak / PDF
                    </button>
                </form>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        ['Jumlah Transaksi', summary.jumlah_transaksi],
                        ['Total Omzet', formatCurrency(summary.omzet)],
                        ['Rata-rata Transaksi', formatCurrency(summary.rata_rata)],
                    ].map(([title, value]) => (
                        <div key={title} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                            <p className="text-sm text-gray-500">{title}</p>
                            <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Produk Terlaris</h2>
                        {topProducts.length === 0 ? <p className="text-sm text-gray-500">Belum ada penjualan.</p> : (
                            <div className="space-y-3 overflow-hidden">
                                {topProducts.map((item, index) => (
                                    <div key={item.id_produk} className="flex items-start justify-between gap-3 border-b pb-2 text-sm">
                                        <span className="min-w-0 break-words">{index + 1}. {item.produk?.nama_produk}</span>
                                        <span className="shrink-0 text-right font-semibold text-blue-600">{item.total_terjual} terjual · {formatCurrency(item.total_penjualan)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Transaksi</h2>
                        {transaksi.length === 0 ? <p className="text-sm text-gray-500">Belum ada transaksi.</p> : (
                            <div className="space-y-3 max-h-80 overflow-y-auto">
                                {transaksi.map((item) => (
                                    <div key={item.id_transaksi} className="flex justify-between border-b pb-2 text-sm">
                                        <span>#{item.id_transaksi} · {item.user?.nama || 'Kasir'}</span>
                                        <span className="font-semibold">{formatCurrency(item.total)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}

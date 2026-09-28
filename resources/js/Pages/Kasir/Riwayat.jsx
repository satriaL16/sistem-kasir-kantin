import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import FlashMessage from '../../Components/FlashMessage';
import AdminSidebar from '../../Components/AdminSidebar';

const formatCurrency = (value) => `Rp ${Number(value).toLocaleString('id-ID')}`;

export default function Riwayat({ transaksi = [], flash, auth }) {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = window.setInterval(() => setCurrentTime(new Date()), 1000);

        return () => window.clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900">
            <Head title="Riwayat Transaksi - Kasir Kantin BPPI" />
            <FlashMessage flash={flash} />
            {auth?.user?.role === 'admin' && <AdminSidebar active="/transaksi/riwayat" />}

            <nav className={`${auth?.user?.role === 'admin' ? 'lg:ml-72' : ''} border-b border-slate-800 bg-slate-950 px-4 py-3 text-white sm:px-6`}>
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-black">
                            BP
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-base font-bold sm:text-lg">Kantin BPPI</p>
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                <span className="inline-flex items-center gap-1.5">
                                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                    Kasir aktif
                                </span>
                                <span className="hidden sm:inline">• Riwayat transaksi</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="hidden text-right sm:block">
                            <p className="text-sm font-semibold text-slate-200">
                                {transaksi.length} transaksi
                            </p>
                            <p className="text-[11px] text-slate-500">
                                {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                        <Link href={auth?.user?.role === 'admin' ? '/admin' : '/kasir'} className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium hover:bg-blue-500 sm:text-sm">
                            {auth?.user?.role === 'admin' ? 'Dashboard' : 'Kasir'}
                        </Link>
                        <Link href="/logout" method="post" as="button" className="rounded-lg px-3 py-2 text-xs font-medium text-red-300 hover:bg-red-950/40 sm:text-sm">
                            Keluar
                        </Link>
                    </div>
                </div>
            </nav>

            <main className={`mx-auto max-w-6xl p-4 sm:p-6 ${auth?.user?.role === 'admin' ? 'pb-24 lg:ml-72 lg:pb-6' : ''}`}>
                <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Aktivitas penjualan</p>
                        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Riwayat transaksi</h1>
                    </div>
                    <p className="text-sm text-slate-500">Klik transaksi untuk melihat detail.</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">

                    {transaksi.length === 0 ? (
                        <p className="rounded-xl bg-slate-50 py-16 text-center text-sm text-slate-500">Belum ada transaksi.</p>
                    ) : (
                        <div className="space-y-4">
                            {transaksi.map((item) => (
                                <details key={item.id_transaksi} className="group overflow-hidden rounded-xl border border-slate-200 transition hover:border-blue-300 hover:shadow-sm">
                                    <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-4 p-4">
                                        <div>
                                            <p className="font-bold text-slate-800">Transaksi #{item.id_transaksi}</p>
                                            <p className="mt-1 text-sm text-slate-500">
                                                {new Date(item.tanggal).toLocaleString('id-ID')} · {item.user?.nama || 'Kasir'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-blue-600">{formatCurrency(item.total)}</p>
                                            <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-400">{item.metode_pembayaran || 'tunai'}</p>
                                        </div>
                                    </summary>
                                    <div className="space-y-2 border-t border-slate-100 bg-slate-50/70 p-4">
                                        {item.detail_transaksi?.map((detail) => (
                                            <div key={detail.id_detail} className="flex justify-between text-sm">
                                                <span>{detail.produk?.nama_produk} × {detail.jumlah}</span>
                                                <span>{formatCurrency(detail.subtotal)}</span>
                                            </div>
                                        ))}
                                        <div className="border-t pt-2 mt-3 flex justify-between text-sm">
                                            <span>Metode pembayaran</span>
                                            <span className="uppercase">{item.metode_pembayaran || 'tunai'}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Uang bayar</span>
                                            <span>{formatCurrency(item.uang_bayar)}</span>
                                        </div>
                                        <div className="flex justify-between font-semibold text-sm">
                                            <span>Kembalian</span>
                                            <span>{formatCurrency(item.kembalian)}</span>
                                        </div>
                                    </div>
                                </details>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

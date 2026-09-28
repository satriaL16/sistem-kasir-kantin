import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import FlashMessage from '../../Components/FlashMessage';
import AdminSidebar from '../../Components/AdminSidebar';

const formatCurrency = (value) => {
    const amount = Number(value);

    return `Rp ${Number.isFinite(amount) ? amount.toLocaleString('id-ID') : '0'}`;
};

const formatDateTime = (value) => {
    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? 'Tanggal tidak tersedia'
        : date.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
};

function Icon({ name, className = 'h-5 w-5' }) {
    const paths = {
        receipt: (
            <>
                <path d="M5 3.5h14v17l-3-1.8-4 1.8-4-1.8-3 1.8v-17Z" />
                <path d="M8 8h8M8 12h8M8 16h4" />
            </>
        ),
        wallet: (
            <>
                <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H19v15H6.5A2.5 2.5 0 0 1 4 16.5v-10Z" />
                <path d="M4 7h15M15 12h4" />
                <circle cx="15" cy="12" r=".5" fill="currentColor" />
            </>
        ),
        trend: (
            <>
                <path d="M4 17 9 12l3 3 7-8" />
                <path d="M15 7h4v4M4 20h16" />
            </>
        ),
        box: (
            <>
                <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
                <path d="m4.5 7.75 7.5 4.5 7.5-4.5M12 12.25V21" />
            </>
        ),
        arrow: <path d="M5 12h13m-5-5 5 5-5 5" />,
        calendar: (
            <>
                <rect x="4" y="5" width="16" height="15" rx="2" />
                <path d="M8 3v4M16 3v4M4 10h16" />
            </>
        ),
        users: (
            <>
                <circle cx="9" cy="8" r="3" />
                <path d="M3.5 20a5.5 5.5 0 0 1 11 0M16 5.5a3 3 0 0 1 0 5.8M17 14a5 5 0 0 1 3.5 6" />
            </>
        ),
    };

    return (
        <svg
            aria-hidden="true"
            className={className}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {paths[name]}
        </svg>
    );
}

function SectionHeading({ icon, eyebrow, title, action }) {
    return (
        <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                    <Icon name={icon} className="h-4.5 w-4.5" />
                </span>
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">{eyebrow}</p>
                    <h2 className="mt-1 text-base font-semibold text-slate-900">{title}</h2>
                </div>
            </div>
            {action}
        </div>
    );
}

export default function Dashboard({
    stats = {},
    topProducts = [],
    lowStockProducts = [],
    salesChart = [],
    recentTransactions = [],
    topCashiers = [],
    flash,
}) {
    const [activeChartIndex, setActiveChartIndex] = useState(Math.max(salesChart.length - 1, 0));
    const safeStats = {
        total_transaksi: stats?.total_transaksi ?? 0,
        transaksi_hari_ini: stats?.transaksi_hari_ini ?? 0,
        omzet: stats?.omzet ?? 0,
        omzet_hari_ini: stats?.omzet_hari_ini ?? 0,
        stok_menipis: stats?.stok_menipis ?? lowStockProducts.length,
    };
    const maxOmzet = Math.max(...salesChart.map((item) => Number(item.omzet) || 0), 1);
    const hasLowStock = safeStats.stok_menipis > 0 || lowStockProducts.length > 0;
    const selectedChartIndex = Math.min(activeChartIndex, Math.max(salesChart.length - 1, 0));
    const activeChartItem = salesChart[selectedChartIndex];

    const metrics = [
        {
            label: 'Total transaksi',
            value: Number(safeStats.total_transaksi).toLocaleString('id-ID'),
            note: 'sepanjang waktu',
            icon: 'receipt',
            tone: 'blue',
        },
        {
            label: 'Transaksi hari ini',
            value: Number(safeStats.transaksi_hari_ini).toLocaleString('id-ID'),
            note: 'aktivitas hari ini',
            icon: 'calendar',
            tone: 'violet',
        },
        {
            label: 'Total omzet',
            value: formatCurrency(safeStats.omzet),
            note: 'sepanjang waktu',
            icon: 'wallet',
            tone: 'emerald',
        },
        {
            label: 'Omzet hari ini',
            value: formatCurrency(safeStats.omzet_hari_ini),
            note: 'pendapatan hari ini',
            icon: 'trend',
            tone: 'amber',
        },
    ];

    const toneClasses = {
        blue: 'bg-blue-50 text-blue-600',
        violet: 'bg-violet-50 text-violet-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        amber: 'bg-amber-50 text-amber-600',
    };

    return (
        <div
            className="min-h-screen bg-[#f6f7f9] text-slate-900 font-sans"
            style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}
        >
            <Head title="Dashboard Admin - Kantin BPPI" />
            <FlashMessage flash={flash} />
            <AdminSidebar active="/admin" />

            <main className="mx-auto max-w-[1500px] space-y-5 px-3 pb-24 pt-5 sm:space-y-6 sm:px-6 sm:pt-6 lg:ml-72 lg:px-8 lg:pb-8 lg:pt-8">
                <header className="flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">Ringkasan operasional</p>
                        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Dashboard admin</h1>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                            Pantau penjualan, aktivitas kasir, dan kondisi stok dalam satu tampilan.
                        </p>
                    </div>
                    <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto">
                        <Link
                            href="/admin/laporan"
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:justify-start"
                        >
                            <Icon name="receipt" className="h-4 w-4" />
                            Lihat laporan
                        </Link>
                        <Link
                            href="/admin/produk"
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 sm:justify-start"
                        >
                            <Icon name="box" className="h-4 w-4" />
                            Kelola produk
                        </Link>
                    </div>
                </header>

                <section aria-label="Ringkasan metrik" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {metrics.map((metric) => (
                        <article key={metric.label} className="border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md sm:p-5">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">{metric.label}</p>
                                    <p className="mt-3 text-xl font-semibold tracking-tight text-slate-950">{metric.value}</p>
                                    <p className="mt-1 text-xs text-slate-400">{metric.note}</p>
                                </div>
                                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${toneClasses[metric.tone]}`}>
                                    <Icon name={metric.icon} className="h-5 w-5" />
                                </span>
                            </div>
                        </article>
                    ))}
                </section>

                {hasLowStock && (
                    <section className="flex flex-col gap-4 border border-amber-200 bg-amber-50/70 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5" aria-label="Peringatan stok">
                        <div className="flex items-start gap-3">
                            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                                <Icon name="box" className="h-4 w-4" />
                            </span>
                            <div>
                                <h2 className="text-sm font-semibold text-amber-950">Perlu perhatian pada stok</h2>
                                <p className="mt-1 text-sm text-amber-800">
                                    {safeStats.stok_menipis} produk berada di bawah batas stok minimum.
                                </p>
                            </div>
                        </div>
                        <Link href="/admin/produk" className="inline-flex items-center gap-1 self-start text-sm font-semibold text-amber-900 hover:text-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 sm:self-auto">
                            Periksa stok <Icon name="arrow" className="h-4 w-4" />
                        </Link>
                    </section>
                )}

                <section className="border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <SectionHeading
                            icon="trend"
                            eyebrow="Performa penjualan"
                            title="Omzet 7 hari terakhir"
                            action={
                                <Link href="/admin/laporan" className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                                    Detail <Icon name="arrow" className="h-4 w-4" />
                                </Link>
                            }
                        />
                    </div>

                    {salesChart.length === 0 ? (
                        <div className="mt-8 flex h-48 items-center justify-center border border-dashed border-slate-200 text-sm text-slate-400">
                            Belum ada data penjualan.
                        </div>
                    ) : (
                        <>
                            {activeChartItem && (
                                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-l-2 border-blue-600 bg-slate-50 px-4 py-3" aria-live="polite">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white text-slate-500 shadow-sm">
                                            <Icon name="calendar" className="h-4 w-4" />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="truncate text-xs font-medium uppercase tracking-wide text-slate-400">{String(activeChartItem.tanggal ?? 'Tanggal tidak tersedia')}</p>
                                            <p className="mt-0.5 text-sm font-semibold text-slate-900">{formatCurrency(activeChartItem.omzet)} omzet</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-500"><span className="font-semibold text-slate-800">{activeChartItem.jumlah_transaksi ?? 0}</span> transaksi</p>
                                </div>
                            )}
                            <div className="mt-6 overflow-x-auto pb-2" aria-label="Grafik omzet tujuh hari terakhir">
                                <div className="flex h-56 min-w-[520px] items-end gap-2 sm:min-w-0 sm:gap-4">
                            {salesChart.map((item, index) => {
                                const omzet = Number(item.omzet) || 0;
                                const height = Math.max((omzet / maxOmzet) * 100, 4);
                                const isActive = index === selectedChartIndex;

                                return (
                                    <div key={item.tanggal} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
                                        <span className="max-w-full truncate text-[10px] font-medium text-slate-500" title={formatCurrency(omzet)}>
                                            {formatCurrency(omzet)}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setActiveChartIndex(index)}
                                            onMouseEnter={() => setActiveChartIndex(index)}
                                            className="group flex h-full w-full items-end rounded-t-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            aria-label={`${item.tanggal}: ${formatCurrency(omzet)}, ${item.jumlah_transaksi ?? 0} transaksi`}
                                        >
                                            <span
                                                className={`block w-full rounded-t-md transition-[height,background-color,opacity] ${isActive ? 'bg-blue-700' : 'bg-blue-500 group-hover:bg-blue-600'}`}
                                                style={{ height: `${height}%` }}
                                                title={`${formatCurrency(omzet)} · ${item.jumlah_transaksi ?? 0} transaksi`}
                                            />
                                        </button>
                                        <span className="text-[10px] text-slate-400">{String(item.tanggal ?? '').slice(5) || '-'}</span>
                                    </div>
                                );
                            })}
                                </div>
                        </div>
                        </>
                    )}
                </section>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <section className="border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:p-6">
                        <SectionHeading icon="trend" eyebrow="Produk" title="Produk terlaris" />
                        {topProducts.length === 0 ? (
                            <p className="mt-6 text-sm text-slate-500">Belum ada data penjualan.</p>
                        ) : (
                            <div className="mt-5 divide-y divide-slate-100">
                                {topProducts.map((item, index) => (
                                    <div key={item.id_produk} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-xs font-semibold text-slate-500">{String(index + 1).padStart(2, '0')}</span>
                                        <p className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700">{item.produk?.nama_produk || 'Produk tidak diketahui'}</p>
                                        <span className="text-sm font-semibold text-slate-900">{item.total_terjual ?? 0} <span className="font-normal text-slate-400">terjual</span></span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <section className="border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:p-6">
                        <SectionHeading
                            icon="box"
                            eyebrow="Inventaris"
                            title="Stok menipis"
                            action={<span className="text-sm font-semibold text-amber-600">{safeStats.stok_menipis} produk</span>}
                        />
                        {lowStockProducts.length === 0 ? (
                            <p className="mt-6 text-sm text-slate-500">Tidak ada stok menipis.</p>
                        ) : (
                            <div className="mt-5 divide-y divide-slate-100">
                                {lowStockProducts.map((item) => (
                                    <div key={item.id_produk} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                                        <span className="h-2 w-2 shrink-0 rounded-full bg-amber-500" />
                                        <p className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700">{item.nama_produk || 'Produk tidak diketahui'}</p>
                                        <span className="text-sm font-semibold text-red-600">{item.stok ?? 0} <span className="font-normal text-slate-400">tersisa</span></span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <section className="border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:p-6">
                        <SectionHeading icon="receipt" eyebrow="Transaksi" title="Aktivitas terbaru" />
                        <div className="mt-5 divide-y divide-slate-100">
                            {recentTransactions.length === 0 ? (
                                <p className="py-1 text-sm text-slate-500">Belum ada aktivitas.</p>
                            ) : recentTransactions.map((item) => (
                                <div key={item.id_transaksi} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><Icon name="receipt" className="h-4 w-4" /></span>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-slate-800">Transaksi #{item.id_transaksi}</p>
                                        <p className="mt-0.5 truncate text-xs text-slate-400">{item.user?.nama || 'Kasir'} · {formatDateTime(item.tanggal)}</p>
                                    </div>
                                    <span className="shrink-0 text-sm font-semibold text-slate-900">{formatCurrency(item.total)}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:p-6">
                        <SectionHeading icon="users" eyebrow="Tim kasir" title="Peringkat kasir" />
                        <div className="mt-5 divide-y divide-slate-100">
                            {topCashiers.length === 0 ? (
                                <p className="py-1 text-sm text-slate-500">Belum ada data kasir.</p>
                            ) : topCashiers.map((item, index) => (
                                <div key={item.id_user} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-xs font-semibold text-slate-500">{String(index + 1).padStart(2, '0')}</span>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-slate-800">{item.user?.nama || item.user?.username || 'Kasir tidak diketahui'}</p>
                                        <p className="mt-0.5 text-xs text-slate-400">{item.jumlah_transaksi ?? 0} transaksi</p>
                                    </div>
                                    <span className="shrink-0 text-sm font-semibold text-slate-900">{formatCurrency(item.omzet)}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

import { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';
import FlashMessage from '../../Components/FlashMessage';

const PRODUCTS_PER_PAGE = 12;

const formatCurrency = (value) => {
    const amount = Number(value);

    return `Rp ${Number.isFinite(amount) ? amount.toLocaleString('id-ID') : '0'}`;
};

function Icon({ name, className = 'h-5 w-5' }) {
    const paths = {
        store: (
            <>
                <path d="M4 10v10h16V10M3 10l2-6h14l2 6" />
                <path d="M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0M9 20v-5h6v5" />
            </>
        ),
        box: (
            <>
                <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
                <path d="m4.5 7.75 7.5 4.5 7.5-4.5M12 12.25V21" />
            </>
        ),
        search: (
            <>
                <circle cx="11" cy="11" r="6.5" />
                <path d="m16 16 4 4" />
            </>
        ),
        filter: (
            <>
                <path d="M4 6h16M7 12h10M10 18h4" />
            </>
        ),
        cart: (
            <>
                <path d="M4 5h2l1.5 10h9.75L20 8H7" />
                <circle cx="9" cy="19" r="1" />
                <circle cx="17" cy="19" r="1" />
            </>
        ),
        plus: <path d="M12 5v14M5 12h14" />,
        minus: <path d="M5 12h14" />,
        trash: (
            <>
                <path d="M5 7h14M10 11v5M14 11v5M9 7V4h6v3M7 7l1 13h8l1-13" />
            </>
        ),
        receipt: (
            <>
                <path d="M5 3.5h14v17l-3-1.8-4 1.8-4-1.8-3 1.8v-17Z" />
                <path d="M8 8h8M8 12h8M8 16h4" />
            </>
        ),
        clock: (
            <>
                <circle cx="12" cy="12" r="8" />
                <path d="M12 7v5l3 2" />
            </>
        ),
        user: (
            <>
                <circle cx="12" cy="8" r="3" />
                <path d="M5 20a7 7 0 0 1 14 0" />
            </>
        ),
        arrowLeft: <path d="M19 12H5m6-6-6 6 6 6" />,
        arrowRight: <path d="M5 12h14m-6-6 6 6-6 6" />,
        logout: (
            <>
                <path d="M10 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h5M14 16l4-4-4-4M9 12h9" />
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

function Pagination({ currentPage, totalPages, onChange }) {
    if (totalPages <= 1) return null;

    return (
        <nav className="mt-6 flex items-center justify-between gap-3" aria-label="Pagination produk">
            <button
                type="button"
                onClick={() => onChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-blue-300 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
                <Icon name="arrowLeft" className="h-4 w-4" />
                <span className="hidden sm:inline">Sebelumnya</span>
            </button>
            <span className="text-xs font-medium text-slate-500">
                Halaman <strong className="text-slate-800">{currentPage}</strong> dari {totalPages}
            </span>
            <button
                type="button"
                onClick={() => onChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-blue-300 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
                <span className="hidden sm:inline">Berikutnya</span>
                <Icon name="arrowRight" className="h-4 w-4" />
            </button>
        </nav>
    );
}

export default function Index({ produk = [], kategori = [], auth, flash, lowStockProducts = [] }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        cart: [],
        uang_bayar: '',
        metode_pembayaran: 'tunai',
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [currentTime, setCurrentTime] = useState(new Date());

    const kasirFlash = flash?.success?.startsWith('Transaksi #')
        ? { ...flash, success: null }
        : flash;

    useEffect(() => {
        const timer = window.setInterval(() => setCurrentTime(new Date()), 1000);

        return () => window.clearInterval(timer);
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCategory]);

    const filteredProduk = produk.filter((item) => {
        const name = String(item.nama_produk ?? '').toLowerCase();
        const matchesSearch = name.includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || String(item.id_kategori) === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const totalPages = Math.max(Math.ceil(filteredProduk.length / PRODUCTS_PER_PAGE), 1);
    const safePage = Math.min(currentPage, totalPages);
    const visibleProduk = filteredProduk.slice((safePage - 1) * PRODUCTS_PER_PAGE, safePage * PRODUCTS_PER_PAGE);

    const addToCart = (item) => {
        if (item.stok <= 0) {
            return Swal.fire({
                icon: 'warning',
                title: 'Stok habis',
                text: 'Produk ini sudah tidak tersedia.',
                confirmButtonColor: '#2563eb',
            });
        }

        const existingIndex = data.cart.findIndex((cartItem) => cartItem.id_produk === item.id_produk);

        if (existingIndex > -1) {
            const updatedCart = [...data.cart];

            if (updatedCart[existingIndex].jumlah < item.stok) {
                updatedCart[existingIndex].jumlah += 1;
                setData('cart', updatedCart);
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Stok terbatas',
                    text: 'Jumlah sudah mencapai stok yang tersedia.',
                    confirmButtonColor: '#2563eb',
                });
            }
        } else {
            setData('cart', [...data.cart, { ...item, jumlah: 1 }]);
        }
    };

    const updateQuantity = (id_produk, delta) => {
        const productInfo = produk.find((item) => item.id_produk === id_produk);
        const updatedCart = data.cart
            .map((item) => {
                if (item.id_produk !== id_produk) return item;

                const newQty = item.jumlah + delta;

                if (newQty > productInfo.stok) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Stok tidak mencukupi',
                        text: 'Jumlah melebihi stok yang tersedia.',
                        confirmButtonColor: '#2563eb',
                    });
                    return item;
                }

                return { ...item, jumlah: newQty };
            })
            .filter((item) => item.jumlah > 0);

        setData('cart', updatedCart);
    };

    const totalBelanja = data.cart.reduce((total, item) => total + (Number(item.harga) * item.jumlah), 0);
    const uangBayar = Number(data.uang_bayar) || 0;
    const kembalian = uangBayar - totalBelanja;
    const quickAmounts = [...new Set([
        totalBelanja,
        Math.ceil(totalBelanja / 5000) * 5000,
        Math.ceil(totalBelanja / 10000) * 10000,
    ])].filter((amount) => amount > 0);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (data.cart.length === 0) {
            return Swal.fire({
                icon: 'info',
                title: 'Keranjang kosong',
                text: 'Tambahkan produk sebelum memproses transaksi.',
                confirmButtonColor: '#2563eb',
            });
        }

        if (uangBayar < totalBelanja) {
            return Swal.fire({
                icon: 'warning',
                title: 'Pembayaran kurang',
                text: 'Nominal pembayaran belum mencukupi.',
                confirmButtonColor: '#2563eb',
            });
        }

        post('/transaksi', {
            onSuccess: (page) => {
                reset();
                Swal.fire({
                    icon: 'success',
                    title: 'Transaksi berhasil',
                    text: page.props.flash?.success || 'Transaksi berhasil disimpan.',
                    confirmButtonColor: '#2563eb',
                });
            },
        });
    };

    return (
        <div className="min-h-screen bg-[#f6f7f9] text-slate-900 font-sans" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}>
            <Head title="Kasir Kantin BPPI" />
            <FlashMessage flash={kasirFlash} />

            <header className="border-b border-slate-800 bg-gray-900 text-white">
                <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-3 px-3 py-3 sm:px-6 lg:px-8">
                    <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
                            <Icon name="store" className="h-5 w-5" />
                        </span>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold tracking-tight sm:text-base">Kantin BPPI</p>
                            <p className="flex items-center gap-1.5 text-[11px] text-slate-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                Kasir aktif
                                <span className="hidden sm:inline">· Point of Sale</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-3">
                        <div className="hidden items-center gap-2 border-r border-slate-800 pr-3 md:flex">
                            <Icon name="clock" className="h-4 w-4 text-slate-500" />
                            <div className="text-right">
                                <p className="text-xs font-semibold text-slate-200">{currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</p>
                                <p className="text-[10px] text-slate-500">{currentTime.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                            </div>
                        </div>
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-500/15 px-2.5 py-1.5 text-xs font-semibold text-blue-200" aria-label={`${data.cart.length} item di keranjang`}>
                            <Icon name="cart" className="h-3.5 w-3.5" />
                            {data.cart.length}
                        </span>
                        <Link href="/transaksi/riwayat" className="hidden rounded-lg px-2.5 py-2 text-xs font-medium text-slate-400 transition hover:bg-slate-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:inline-flex sm:text-sm">
                            Riwayat
                        </Link>
                        {auth?.user?.role === 'admin' && (
                            <Link href="/admin" className="hidden rounded-lg bg-blue-600 px-2.5 py-2 text-xs font-medium transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 sm:inline-flex">
                                Admin
                            </Link>
                        )}
                        <Link href="/logout" method="post" as="button" className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium text-red-300 transition hover:bg-red-950/40 hover:text-red-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 sm:text-sm">
                            <Icon name="logout" className="h-4 w-4" />
                            <span className="hidden sm:inline">Keluar</span>
                        </Link>
                    </div>
                </div>
            </header>

            {lowStockProducts.length > 0 && (
                <div className="mx-auto mt-4 max-w-[1500px] px-3 sm:px-6 lg:px-8">
                    <div className="flex items-start gap-3 border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        <Icon name="box" className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                        <p className="min-w-0 leading-6">
                            <strong className="font-semibold text-amber-950">Stok menipis:</strong>{' '}
                            {lowStockProducts.slice(0, 3).map((item) => `${item.nama_produk} (${item.stok})`).join(', ')}
                            {lowStockProducts.length > 3 && ` dan ${lowStockProducts.length - 3} produk lainnya`}.
                        </p>
                    </div>
                </div>
            )}

            {errors.cart && (
                <div className="mx-auto mt-4 max-w-[1500px] px-3 sm:px-6 lg:px-8">
                    <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{errors.cart}</div>
                </div>
            )}

            <main className="mx-auto grid max-w-[1500px] gap-5 px-3 pb-8 pt-5 sm:px-6 sm:pt-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-8">
                <section className="min-w-0">
                    <div className="mb-5 flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-600">Point of sale</p>
                            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Pilih produk</h1>
                            <p className="mt-2 text-sm text-slate-500">
                                Menampilkan {filteredProduk.length} produk
                                {searchTerm && <> untuk <span className="font-medium text-slate-700">“{searchTerm}”</span></>}.
                            </p>
                        </div>

                        <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto">
                            <label className="relative block sm:w-56">
                                <span className="sr-only">Cari produk</span>
                                <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="search"
                                    placeholder="Cari produk..."
                                    value={searchTerm}
                                    onChange={(event) => setSearchTerm(event.target.value)}
                                    className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </label>
                            <label className="relative block sm:w-44">
                                <span className="sr-only">Filter kategori</span>
                                <Icon name="filter" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <select
                                    value={selectedCategory}
                                    onChange={(event) => setSelectedCategory(event.target.value)}
                                    className="w-full appearance-none rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="">Semua kategori</option>
                                    {kategori.map((item) => <option key={item.id_kategori} value={item.id_kategori}>{item.nama_kategori}</option>)}
                                </select>
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                        {visibleProduk.length === 0 ? (
                            <div className="col-span-full flex min-h-56 flex-col items-center justify-center border border-dashed border-slate-300 bg-white px-6 text-center">
                                <Icon name="search" className="h-8 w-8 text-slate-300" />
                                <p className="mt-3 text-sm font-medium text-slate-600">Produk tidak ditemukan</p>
                                <p className="mt-1 text-xs text-slate-400">Coba ubah kata pencarian atau kategori.</p>
                            </div>
                        ) : visibleProduk.map((item) => (
                            <button
                                key={item.id_produk}
                                type="button"
                                onClick={() => addToCart(item)}
                                disabled={item.stok <= 0}
                                className={`group flex min-h-40 flex-col justify-between border bg-white p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${item.stok > 0
                                        ? 'border-slate-200 hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-md'
                                        : 'cursor-not-allowed border-slate-200 bg-slate-50 opacity-55'
                                    }`}
                            >
                                <div className="min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <span className="truncate rounded-md bg-blue-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-blue-600">{item.kategori?.nama_kategori || 'Umum'}</span>
                                        {item.stok > 0 && <Icon name="plus" className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-blue-600" />}
                                    </div>
                                    <h2 className="mt-3 line-clamp-2 text-sm font-semibold leading-5 text-slate-800">{item.nama_produk}</h2>
                                </div>
                                <div className="mt-5 flex items-end justify-between gap-2">
                                    <span className="text-sm font-semibold text-blue-600">{formatCurrency(item.harga)}</span>
                                    <span className={`text-[11px] font-medium ${item.stok > 0 ? 'text-slate-400' : 'text-red-500'}`}>
                                        {item.stok > 0 ? `${item.stok} stok` : 'Habis'}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>

                    <Pagination currentPage={safePage} totalPages={totalPages} onChange={setCurrentPage} />
                </section>

                <aside className="min-w-0">
                    <div className="flex flex-col border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-5 lg:sticky lg:top-5">
                        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-600">Pesanan aktif</p>
                                <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">Keranjang</h2>
                            </div>
                            <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-600">
                                <Icon name="cart" className="h-3.5 w-3.5" />
                                {data.cart.length} item
                            </span>
                        </div>

                        {data.cart.length > 0 ? (
                            <button
                                type="button"
                                onClick={() => setData('cart', [])}
                                className="mt-3 inline-flex items-center gap-1.5 self-start text-xs font-semibold text-red-600 transition hover:text-red-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                            >
                                <Icon name="trash" className="h-3.5 w-3.5" />
                                Kosongkan keranjang
                            </button>
                        ) : null}

                        <div className="my-4 max-h-[42vh] space-y-3 overflow-y-auto pr-1">
                            {data.cart.length === 0 ? (
                                <div className="flex min-h-44 flex-col items-center justify-center bg-slate-50 px-4 text-center">
                                    <Icon name="cart" className="h-8 w-8 text-slate-300" />
                                    <p className="mt-3 text-sm font-medium text-slate-500">Belum ada item</p>
                                    <p className="mt-1 text-xs text-slate-400">Klik produk untuk menambahkannya.</p>
                                </div>
                            ) : data.cart.map((item) => (
                                <div key={item.id_produk} className="flex items-center gap-3 border-b border-slate-100 pb-3 last:border-0">
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-slate-800">{item.nama_produk}</p>
                                        <p className="mt-1 text-xs text-slate-400">{formatCurrency(item.harga)}</p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button type="button" onClick={() => updateQuantity(item.id_produk, -1)} aria-label={`Kurangi ${item.nama_produk}`} className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-slate-600 transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                                            <Icon name="minus" className="h-3.5 w-3.5" />
                                        </button>
                                        <span className="w-6 text-center text-sm font-semibold text-slate-700">{item.jumlah}</span>
                                        <button type="button" onClick={() => updateQuantity(item.id_produk, 1)} aria-label={`Tambah ${item.nama_produk}`} className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-blue-600 transition hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                                            <Icon name="plus" className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-3 border-t border-slate-100 pt-4">
                            <div className="flex items-center justify-between gap-3 text-sm font-semibold text-slate-700">
                                <span>Total tagihan</span>
                                <span className="text-lg font-semibold text-blue-600" aria-live="polite">{formatCurrency(totalBelanja)}</span>
                            </div>

                            <div>
                                <label htmlFor="uang-bayar" className="mb-1.5 block text-xs font-semibold text-slate-600">Nominal pembayaran</label>
                                <input
                                    id="uang-bayar"
                                    type="number"
                                    min="0"
                                    inputMode="decimal"
                                    value={data.uang_bayar}
                                    onChange={(event) => setData('uang_bayar', event.target.value)}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    placeholder="Masukkan nominal"
                                    required
                                />
                                {quickAmounts.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                        {quickAmounts.map((amount) => (
                                            <button key={amount} type="button" onClick={() => setData('uang_bayar', String(amount))} className="rounded-md border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-500 transition hover:border-blue-300 hover:text-blue-600">
                                                {formatCurrency(amount)}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                {errors.uang_bayar && <p className="mt-1 text-xs text-red-500">{errors.uang_bayar}</p>}
                            </div>

                            <div>
                                <label htmlFor="metode-pembayaran" className="mb-1.5 block text-xs font-semibold text-slate-600">Metode pembayaran</label>
                                <select
                                    id="metode-pembayaran"
                                    value={data.metode_pembayaran}
                                    onChange={(event) => setData('metode_pembayaran', event.target.value)}
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="tunai">Tunai</option>
                                    <option value="qris">QRIS</option>
                                    <option value="transfer">Transfer</option>
                                </select>
                                {errors.metode_pembayaran && <p className="mt-1 text-xs text-red-500">{errors.metode_pembayaran}</p>}
                            </div>

                            <div className="flex items-center justify-between bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-700">
                                <span>Kembalian</span>
                                <span className={kembalian >= 0 ? 'text-emerald-600' : 'text-red-600'}>{kembalian >= 0 ? formatCurrency(kembalian) : `-${formatCurrency(Math.abs(kembalian))}`}</span>
                            </div>

                            <button
                                type="submit"
                                disabled={processing || data.cart.length === 0 || kembalian < 0}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300"
                            >
                                <Icon name="receipt" className="h-4 w-4" />
                                {processing ? 'Memproses...' : 'Proses pembayaran'}
                            </button>
                        </form>
                    </div>
                </aside>
            </main>
        </div>
    );
}

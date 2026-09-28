import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

const items = [
    { label: 'Dashboard', href: '/admin', icon: 'dashboard' },
    { label: 'Produk', href: '/admin/produk', icon: 'box' },
    { label: 'Kategori', href: '/admin/kategori', icon: 'tag' },
    { label: 'Pengguna', href: '/admin/users', icon: 'users' },
    { label: 'Laporan', href: '/admin/laporan', icon: 'chart' },
    { label: 'Riwayat transaksi', href: '/transaksi/riwayat', icon: 'receipt' },
];

function Icon({ name, className = 'h-5 w-5' }) {
    const paths = {
        dashboard: (
            <>
                <rect x="4" y="4" width="6" height="6" rx="1" />
                <rect x="14" y="4" width="6" height="6" rx="1" />
                <rect x="4" y="14" width="6" height="6" rx="1" />
                <rect x="14" y="14" width="6" height="6" rx="1" />
            </>
        ),
        box: (
            <>
                <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
                <path d="m4.5 7.75 7.5 4.5 7.5-4.5M12 12.25V21" />
            </>
        ),
        tag: (
            <>
                <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H12l7.5 7.5a2 2 0 0 1 0 2.8l-5.2 5.2a2 2 0 0 1-2.8 0L4 12V5.5Z" />
                <circle cx="8" cy="8" r="1" />
            </>
        ),
        users: (
            <>
                <circle cx="9" cy="8" r="3" />
                <path d="M3.5 20a5.5 5.5 0 0 1 11 0M16 5.5a3 3 0 0 1 0 5.8M17 14a5 5 0 0 1 3.5 6" />
            </>
        ),
        chart: (
            <>
                <path d="M4 19V5M4 19h16" />
                <path d="m7 15 3-4 3 2 4-6" />
                <path d="M14 7h3v3" />
            </>
        ),
        receipt: (
            <>
                <path d="M5 3.5h14v17l-3-1.8-4 1.8-4-1.8-3 1.8v-17Z" />
                <path d="M8 8h8M8 12h8M8 16h4" />
            </>
        ),
        store: (
            <>
                <path d="M4 10v10h16V10M3 10l2-6h14l2 6" />
                <path d="M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0M9 20v-5h6v5" />
            </>
        ),
        menu: <path d="M4 7h16M4 12h16M4 17h16" />,
        close: <path d="m6 6 12 12M18 6 6 18" />,
        logout: (
            <>
                <path d="M10 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h5M14 16l4-4-4-4M9 12h9" />
            </>
        ),
        arrow: <path d="M5 12h13m-5-5 5 5-5 5" />,
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

function Brand({ compact = false }) {
    return (
        <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Icon name="store" className="h-5 w-5" />
            </span>
            {!compact && (
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold tracking-tight text-white">Kantin BPPI</p>
                    <p className="truncate text-[11px] text-slate-400">Panel administrasi</p>
                </div>
            )}
        </div>
    );
}

function UserSummary({ user }) {
    const displayName = user?.nama || user?.username || 'Administrator';
    const initials = displayName.trim().charAt(0).toUpperCase() || 'A';

    return (
        <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold text-slate-100">
                {initials}
            </span>
            <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-100">{displayName}</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    {user?.role || 'admin'} aktif
                </p>
            </div>
        </div>
    );
}

function Navigation({ activePath, onNavigate }) {
    return (
        <nav className="space-y-1" aria-label="Navigasi admin">
            {items.map((item) => {
                const isActive = activePath === item.href || (item.href !== '/admin' && activePath?.startsWith(`${item.href}/`));

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={onNavigate}
                        aria-current={isActive ? 'page' : undefined}
                        className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
                            isActive
                                ? 'bg-slate-800 text-white'
                                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                        }`}
                    >
                        {isActive && <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-blue-400" />}
                        <Icon name={item.icon} className={`h-[18px] w-[18px] shrink-0 ${isActive ? 'text-blue-300' : 'text-slate-500 group-hover:text-slate-300'}`} />
                        <span className="truncate">{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}

export default function AdminSidebar({ active }) {
    const page = usePage();
    const { auth } = page.props;
    const user = auth?.user;
    const [mobileOpen, setMobileOpen] = useState(false);
    const activePath = active || page.url || '';

    return (
        <>
            <div className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}>
                <Brand />
                <button
                    type="button"
                    onClick={() => setMobileOpen((open) => !open)}
                    aria-expanded={mobileOpen}
                    aria-controls="mobile-admin-navigation"
                    aria-label={mobileOpen ? 'Tutup menu admin' : 'Buka menu admin'}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                    <Icon name={mobileOpen ? 'close' : 'menu'} className="h-5 w-5" />
                </button>
            </div>

            <aside
                className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-slate-800 bg-gray-900 px-3 py-5 text-white lg:flex"
                style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}
            >
                <div className="px-2">
                    <Brand />
                </div>

                <div className="mt-8 border-y border-slate-800 py-4">
                    <UserSummary user={user} />
                </div>

                <div className="mt-6 flex-1 overflow-y-auto">
                    <Navigation activePath={activePath} />
                </div>

                <div className="mt-5 space-y-1 border-t border-slate-800 pt-4">
                    <Link
                        href="/kasir"
                        className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-slate-900 hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                    >
                        <Icon name="store" className="h-[18px] w-[18px] text-slate-500 group-hover:text-slate-300" />
                        Buka kasir
                        <Icon name="arrow" className="ml-auto h-4 w-4" />
                    </Link>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-400 transition hover:bg-red-950/40 hover:text-red-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                    >
                        <Icon name="logout" className="h-[18px] w-[18px] text-slate-500 group-hover:text-red-300" />
                        Keluar
                    </Link>
                </div>
            </aside>

            {mobileOpen && (
                <>
                    <button
                        type="button"
                        aria-label="Tutup menu admin"
                        onClick={() => setMobileOpen(false)}
                        className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[2px] lg:hidden"
                    />
                    <aside
                        id="mobile-admin-navigation"
                        className="fixed inset-y-0 left-0 z-50 flex w-[min(18rem,calc(100%-2rem))] flex-col bg-slate-950 px-3 py-5 text-white shadow-2xl lg:hidden"
                        style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}
                    >
                        <div className="flex items-center justify-between px-2">
                            <Brand />
                            <button
                                type="button"
                                onClick={() => setMobileOpen(false)}
                                aria-label="Tutup menu admin"
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                            >
                                <Icon name="close" className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mt-7 border-y border-slate-800 py-4">
                            <UserSummary user={user} />
                        </div>

                        <div className="mt-6 flex-1 overflow-y-auto">
                            <Navigation activePath={activePath} onNavigate={() => setMobileOpen(false)} />
                        </div>

                        <div className="mt-5 space-y-1 border-t border-slate-800 pt-4">
                            <Link href="/kasir" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-slate-900 hover:text-slate-100">
                                <Icon name="store" className="h-[18px] w-[18px] text-slate-500" />
                                Buka kasir
                                <Icon name="arrow" className="ml-auto h-4 w-4" />
                            </Link>
                            <Link href="/logout" method="post" as="button" onClick={() => setMobileOpen(false)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-400 transition hover:bg-red-950/40 hover:text-red-200">
                                <Icon name="logout" className="h-[18px] w-[18px] text-slate-500" />
                                Keluar
                            </Link>
                        </div>
                    </aside>
                </>
            )}
        </>
    );
}

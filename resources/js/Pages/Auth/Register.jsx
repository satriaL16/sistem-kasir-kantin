import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

function Icon({ name, className = 'h-5 w-5' }) {
    const paths = {
        store: (
            <>
                <path d="M4 10v10h16V10M3 10l2-6h14l2 6" />
                <path d="M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0M9 20v-5h6v5" />
            </>
        ),
        user: (
            <>
                <circle cx="12" cy="8" r="3" />
                <path d="M5 20a7 7 0 0 1 14 0" />
            </>
        ),
        lock: (
            <>
                <rect x="5" y="10" width="14" height="10" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v2" />
            </>
        ),
        eye: (
            <>
                <path d="M2.5 12s3.5-5 9.5-5 9.5 5 9.5 5-3.5 5-9.5 5-9.5-5-9.5-5Z" />
                <circle cx="12" cy="12" r="2.5" />
            </>
        ),
        eyeOff: (
            <>
                <path d="m3 3 18 18M10.6 6.2A10.8 10.8 0 0 1 12 6c6 0 9.5 6 9.5 6a16 16 0 0 1-3.2 3.5M6.2 6.8C3.8 8.3 2.5 12 2.5 12S6 18 12 18c1.4 0 2.6-.3 3.7-.8" />
                <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
            </>
        ),
        check: <path d="m5 12 4 4L19 6" />,
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

function FieldError({ id, message }) {
    if (!message) return null;

    return <p id={id} className="mt-1.5 text-xs text-red-600" role="alert">{message}</p>;
}

function PasswordField({ id, label, value, onChange, error, placeholder, show, onToggle, describedBy }) {
    return (
        <div>
            <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
            <div className="relative">
                <Icon name="lock" className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
                <input
                    id={id}
                    type={show ? 'text' : 'password'}
                    value={value}
                    onChange={onChange}
                    className={`w-full rounded-lg border bg-white py-3 pl-10 pr-11 text-sm outline-none transition placeholder:text-slate-400 focus:ring-2 ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'}`}
                    placeholder={placeholder}
                    autoComplete={id === 'password' ? 'new-password' : 'new-password'}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? describedBy : undefined}
                />
                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    aria-label={show ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                    <Icon name={show ? 'eyeOff' : 'eye'} className="h-[18px] w-[18px]" />
                </button>
            </div>
            <FieldError id={describedBy} message={error} />
        </div>
    );
}

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        nama: '',
        username: '',
        password: '',
        password_confirmation: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const passwordsMatch = !data.password_confirmation || data.password === data.password_confirmation;

    const submit = (event) => {
        event.preventDefault();
        if (!passwordsMatch) return;
        post('/register');
    };

    return (
        <div className="min-h-screen bg-[#f6f7f9] font-sans text-slate-900" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}>
            <Head title="Register - Kasir Kantin BPPI" />

            <main className="mx-auto grid min-h-screen max-w-[1440px] lg:grid-cols-[minmax(0,1fr)_minmax(420px,540px)]">
                <section className="relative hidden overflow-hidden bg-slate-950 px-10 py-10 text-white lg:flex lg:flex-col xl:px-16" aria-label="Informasi pendaftaran">
                    <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                            <Icon name="store" className="h-5 w-5" />
                        </span>
                        <div>
                            <p className="text-sm font-semibold tracking-tight">Kantin BPPI</p>
                            <p className="text-[11px] text-slate-400">Sistem operasional kantin</p>
                        </div>
                    </div>

                    <div className="my-auto max-w-lg">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">Akun baru</p>
                        <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-white xl:text-5xl">
                            Siapkan akses untuk tim kantin.
                        </h1>
                        <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
                            Buat akun untuk mulai menggunakan kasir dan membantu pengelolaan operasional harian.
                        </p>

                        <div className="mt-8 space-y-3">
                            {['Satu akun untuk akses kerja', 'Data transaksi tetap terorganisir', 'Siap digunakan setelah terdaftar'].map((item) => (
                                <div key={item} className="flex items-center gap-3 text-sm text-slate-300">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-blue-300">
                                        <Icon name="check" className="h-3.5 w-3.5" />
                                    </span>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="text-xs text-slate-500">© {new Date().getFullYear()} Kantin BPPI</p>
                </section>

                <section className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-8 lg:bg-white lg:px-12 xl:px-16">
                    <div className="w-full max-w-md">
                        <div className="mb-8 flex items-center gap-3 lg:hidden">
                            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                                <Icon name="store" className="h-5 w-5" />
                            </span>
                            <div>
                                <p className="text-sm font-semibold tracking-tight">Kantin BPPI</p>
                                <p className="text-[11px] text-slate-500">Sistem operasional kantin</p>
                            </div>
                        </div>

                        <div className="border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] sm:p-8 lg:border-0 lg:p-0 lg:shadow-none">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">Akses akun</p>
                                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Buat akun kasir</h2>
                                <p className="mt-2 text-sm leading-6 text-slate-500">Isi data berikut untuk membuat akun baru di sistem.</p>
                            </div>

                            <form onSubmit={submit} className="mt-8 space-y-4">
                                <div>
                                    <label htmlFor="nama" className="mb-1.5 block text-sm font-medium text-slate-700">Nama lengkap</label>
                                    <div className="relative">
                                        <Icon name="user" className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
                                        <input
                                            id="nama"
                                            type="text"
                                            value={data.nama}
                                            onChange={(event) => setData('nama', event.target.value)}
                                            className={`w-full rounded-lg border bg-white py-3 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:ring-2 ${errors.nama ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'}`}
                                            placeholder="Masukkan nama lengkap"
                                            autoComplete="name"
                                            autoFocus
                                            aria-invalid={Boolean(errors.nama)}
                                            aria-describedby={errors.nama ? 'nama-error' : undefined}
                                        />
                                    </div>
                                    <FieldError id="nama-error" message={errors.nama} />
                                </div>

                                <div>
                                    <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-slate-700">Username</label>
                                    <div className="relative">
                                        <Icon name="user" className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
                                        <input
                                            id="username"
                                            type="text"
                                            value={data.username}
                                            onChange={(event) => setData('username', event.target.value)}
                                            className={`w-full rounded-lg border bg-white py-3 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:ring-2 ${errors.username ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'}`}
                                            placeholder="Buat username"
                                            autoComplete="username"
                                            aria-invalid={Boolean(errors.username)}
                                            aria-describedby={errors.username ? 'username-error' : undefined}
                                        />
                                    </div>
                                    <FieldError id="username-error" message={errors.username} />
                                </div>

                                <PasswordField
                                    id="password"
                                    label="Password"
                                    value={data.password}
                                    onChange={(event) => setData('password', event.target.value)}
                                    error={errors.password}
                                    placeholder="Minimal 6 karakter"
                                    show={showPassword}
                                    onToggle={() => setShowPassword((visible) => !visible)}
                                    describedBy="password-error"
                                />

                                <PasswordField
                                    id="password_confirmation"
                                    label="Konfirmasi password"
                                    value={data.password_confirmation}
                                    onChange={(event) => setData('password_confirmation', event.target.value)}
                                    error={errors.password_confirmation || (!passwordsMatch ? 'Password belum sama.' : undefined)}
                                    placeholder="Ulangi password"
                                    show={showConfirmation}
                                    onToggle={() => setShowConfirmation((visible) => !visible)}
                                    describedBy="password-confirmation-error"
                                />

                                <button
                                    type="submit"
                                    disabled={processing || !passwordsMatch}
                                    className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300"
                                >
                                    {processing ? 'Memproses...' : 'Daftar akun'}
                                    {!processing && <Icon name="arrow" className="h-4 w-4" />}
                                </button>
                            </form>

                            <p className="mt-7 text-center text-sm text-slate-500">
                                Sudah punya akun?{' '}
                                <Link href="/login" className="font-semibold text-blue-600 transition hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                                    Masuk di sini
                                </Link>
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );  
}

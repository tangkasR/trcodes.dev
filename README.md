# trcodes — Enterprise Portfolio & RBAC Management Platform

<p align="center">
  <strong>Platform Portofolio & Sistem Manajemen Role Berstandar Enterprise</strong><br>
  Dibangun dengan arsitektur modern Next.js 16 App Router, Prisma 7, PostgreSQL, Dynamic RBAC, Multi-Factor Authentication (MFA / TOTP), dan Optimasi AI Search (GEO / Generative Engine Optimization).
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.4.1-black?style=for-the-badge&logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Prisma-7.7.0-2D3748?style=for-the-badge&logo=prisma" alt="Prisma 7" />
  <img src="https://img.shields.io/badge/PostgreSQL-15+-336791?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Playwright-Smoke_Tested-2EAD33?style=for-the-badge&logo=playwright" alt="Playwright" />
</p>

---

## 🌟 Ikhtisar (Overview)

**trcodes** adalah aplikasi web fullstack skala enterprise yang menggabungkan halaman publik berkinerja tinggi (*public-facing portfolio & technical case studies*) dengan panel administrasi eksekutif (*role-based backoffice dashboard*). 

Aplikasi ini dirancang dengan prinsip **Clean Modular Architecture**, memisahkan secara ketat modul publik dan modul dashboard, serta mengedepankan keamanan tingkat tinggi (Strict Nonce-based CSP, Session Revocation, Distributed Rate Limiter, MFA TOTP) serta kesiapan mesin pencari generasi baru (SEO 100/100 & GEO / AI Engine Citation).

---

## 🚀 Fitur Unggulan (Key Features)

### 1. Public Portfolio & Technical Storytelling
- **Full Server-Side Rendering (SSR) & Streaming**: Memanfaatkan React `<Suspense>` boundaries dengan skeleton terstandarisasi untuk pemuatan data instan tanpa layout shift (Zero CLS).
- **Tipografi & Desain Elegan**: Menggunakan font serif Google *Newsreader* dan *Geist*, dipadukan dengan palet warna bernuansa *editorial ink & paper*.
- **Bab Studi Kasus Proyek (Project Chapters)**: Dokumentasi mendalam teknis (*Problem, Solution, Architecture, Trade-offs*) yang disajikan secara interaktif.
- **Dukungan Media Interaktif**: Galeri gambar, tautan eksternal tersanitasi, serta riwayat pengalaman, pendidikan, dan sertifikasi profesional.

### 2. Executive Dashboard & UI/UX Terpadu
- **Command Center & Real-time Metrics**: KPI Cards dinamis yang menampilkan statistik proyek, bab, akun aktif, log audit, serta metrik percobaan login.
- **Pagination Dinamis dengan Custom Limit**: Kontrol limit data per halaman yang fleksibel (opsi preset: `10`, `25`, `50`, `100`, `Semua`, serta opsi `Kustom` untuk memasukkan nominal baris sesuai kebutuhan).
- **Sistem Modal Glassmorphism**: Desain dialog modern dengan *backdrop blur*, animasi halus, header squircle icon badge, navigasi keyboard (`ESC`), dan aksi footer yang konsisten.
- **Sistem Form Terstandarisasi**: Seluruh input teks, area teks, dropdown select, angka, checkbox, dan switch toggle menggunakan utility tokens terpusat di `utils/form-styles.ts`.

### 3. Keamanan Skala Enterprise (Security Hardening)
- **Strict Content Security Policy (CSP)**: Nonce dinamis dibangun per-request di `proxy.ts` (pengganti `middleware.ts` pada Next.js 16). Menghapus sepenuhnya `'unsafe-inline'` pada scripts dan styles di lingkungan produksi.
- **Session Management & Device Revocation**: Token JWT HS256 (12 jam) dikaitkan ke tabel basis data `user_sessions` melalui klaim `sid`. Pengguna dapat memantau sesi aktif di berbagai perangkat dan mencabut akses (*revoke session*) secara instan.
- **Two-Factor Authentication (MFA / TOTP)**:
  - Kunci rahasia TOTP disimpan terenkripsi menggunakan algoritma **AES-256-GCM**.
  - Kode pemulihan (*recovery codes*) disimpan dalam bentuk hash SHA-256 sekali pakai.
  - Penegakan wajib MFA bagi Super Admin dengan perlindungan brute force.
- **Distributed Rate Limiting**: Engine rate limiter berbasis PostgreSQL (`rate_limit_buckets`) dengan atomic upsert dan fallback otomatis ke in-memory storage jika koneksi basis data terganggu.
- **Append-only Audit Trails**: Seluruh aktivitas mutasi penting tercatat otomatis di tabel `audit_logs` dengan sanitasi ketat terhadap informasi rahasia.

### 4. Dynamic RBAC & Matrix Permissions
- Sistem hak akses multi-level: Role, Feature, dan Action (`create`, `read`, `update`, `delete`).
- Matrix izin interaktif untuk mengelola hak akses per peran pengguna secara granular.
- Proteksi berlapis: routing guard di `proxy.ts`, pengecekan halaman via `requirePageAccess`, mutasi via `requirePermission`, dan UI conditional rendering via hook `usePermission`.

### 5. SEO & Generative Engine Optimization (GEO)
- **Dynamic Sitemap & Robots**: Mengenerate `sitemap.xml` dinamis dari seluruh rute publik dan database (`app/sitemap.ts`) serta `robots.txt` ramah crawler (`app/robots.ts`).
- **Dynamic OpenGraph Images**: Auto-generation banner visual media sosial menggunakan `@vercel/og` (`app/opengraph-image.tsx`).
- **Schema.org Structured Data (JSON-LD)**: Rich snippet schema `Person`, `ProfilePage`, dan `TechArticle` untuk pemahaman entitas mesin pencari.
- **AI Search Engine Ready**: Menyediakan file standar industri `public/llms.txt` dan `public/llms-full.txt`, serta endpoint raw markdown (`/api/llm/content/[project]/[bab]`) untuk efisiensi konsumsi model AI (ChatGPT Search, Perplexity AI, Google Gemini).

---

## 🛠️ Tech Stack

| Layer | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16.4.1](https://nextjs.org/) | App Router, Turbopack, Cache Components, Server Actions |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Strict type-safety end-to-end |
| **Database** | [PostgreSQL](https://www.postgresql.org/) | Basis data relasional utama |
| **ORM** | [Prisma 7.7.0](https://www.prisma.io/) | `@prisma/client`, `@prisma/adapter-pg`, konfigurasi `prisma7.config.ts` |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | `@tailwindcss/turbopack`, CSS variables tokens di `globals.css` |
| **Icons & Fonts** | FontAwesome & Google Fonts | Newsreader, Geist Sans, FontAwesome 6 |
| **Client State & Tables** | TanStack React Query v5 | Cache data client-side & sinkronisasi otomatis |
| **Validation** | [Zod 3](https://zod.dev/) | Validasi skema input form & server contract (`jitless: true`) |
| **Cryptography & Auth** | Jose, Bcryptjs, TOTP | Enkripsi JWT HS256, AES-256-GCM, SHA-256 hashing |
| **Testing** | [Playwright Core](https://playwright.dev/) | End-to-end smoke testing terotomatisasi |

---

## 📁 Struktur Direktori (Project Architecture)

Aplikasi mengadopsi pola arsitektur **Modular by Audience**:

```text
trcodes/
├── app/                             # Routing boundary murni (Next.js App Router)
│   ├── (public)/                    # Route grup publik (Home, Blog, Experiences, Login)
│   ├── (dashboard)/                 # Route grup dashboard (Admin Backoffice)
│   ├── api/                         # Endpoint JSON read-only & API LLM Content
│   ├── globals.css                  # Token desain Tailwind v4 & custom variables
│   ├── layout.tsx                   # Root layout dengan dynamic connection & CSP Nonce
│   ├── proxy.ts                     # Next.js 16 proxy/middleware untuk Nonce CSP & Auth check
│   ├── sitemap.ts                   # Dynamic XML sitemap generator
│   └── robots.ts                    # Robot crawler directives
├── components/                      # Reusable cross-page components (PublicShell, Modal, dll)
├── config.ts                        # Source of truth untuk FEATURES & NAV_GROUPS
├── lib/                             # Data Layer terisolasi (db.ts, auth.ts, audit.ts, mfa.ts)
├── modules/                         # Implementasi bisnis modular
│   ├── public/                      # Modul halaman publik
│   │   ├── home/                    # Halaman landing & profil
│   │   ├── experiences/             # Daftar pengalaman karir
│   │   ├── experience-detail/       # Detail pengalaman
│   │   ├── blog-chapter/            # Bab proyek teknis & studi kasus
│   │   └── auth/                    # Alur login & challenge MFA
│   └── dashboard/                   # Modul fitur dashboard
│       ├── dashboard/               # Beranda KPI metrik
│       ├── profile/                 # Kelola identitas & profil
│       ├── projects/ & chapters/    # Manajemen portofolio & bab studi kasus
│       ├── experiences/             # Manajemen karir & pengalaman kerja
│       ├── educations/              # Manajemen riwayat pendidikan
│       ├── certifications/          # Manajemen lisensi & sertifikasi
│       ├── contact-links/           # Manajemen tautan kontak sosial
│       ├── users/ & roles/          # Manajemen akun pengguna & peran
│       ├── features/                # Manajemen entitas fitur sistem
│       ├── role-permission/         # Matriks hak akses RBAC
│       ├── audit-logs/              # Log jejak audit keamanan
│       ├── login-attempts/          # Monitoring percobaan login & rate limit
│       └── security/                # Panel MFA TOTP & Revokasi Sesi Perangkat
├── prisma/                          # Skema basis data & seeders
│   ├── schema.prisma                # Definisi tabel PostgreSQL & relasi
│   ├── seed.ts                      # Script destructive seeding
│   └── seed-data.ts                 # Master data inisialisasi awal
├── public/                          # Asset publik statis (avatar, logo, llms.txt)
├── utils/                           # Helper murni (form-styles, url, swal, format-period)
├── prisma7.config.ts                # Konfigurasi runner Prisma 7
└── next.config.ts                   # Konfigurasi Turbopack & Security Headers
```

---

## ⚙️ Persiapan & Instalasi (Getting Started)

### Prasyarat Sistem
- **Node.js**: Versi `20.x` atau lebih baru
- **PostgreSQL**: Versi `15.x` atau lebih baru
- **Package Manager**: `npm`

### 1. Clone Repository & Install Dependencies
```bash
git clone https://github.com/username/trcodes.git
cd trcodes
npm install
```
> *Catatan: Proses `postinstall` akan secara otomatis menjalankan `npx prisma generate` ke direktori `@/app/generated/prisma`.*

### 2. Konfigurasi Environment Variables
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```

Sesuaikan nilai-nilai berikut di dalam `.env`:
```env
# Koneksi Basis Data PostgreSQL
DATABASE_URL="postgresql://postgres:PASSWORD@localhost:5432/db_trcodes"

# Secret Session JWT (Minimal 32 Karakter Acak)
SESSION_SECRET="kombinasi-string-acak-super-aman-minimal-32-karakter"

# Opsional: Kunci Enkripsi MFA AES-256-GCM (Minimal 32 Karakter)
# Jika dikosongkan, otomatis diturunkan dari SESSION_SECRET
MFA_ENCRYPTION_KEY=""

# Akun Awal Super Admin (Digunakan saat menjalankan database seed)
SEED_ADMIN_NAME="Super Administrator"
SEED_ADMIN_EMAIL="admin@trcodes.local"
SEED_ADMIN_PASSWORD="PasswordSangatKuat123!"

# Keamanan & Kebijakan
ENFORCE_SUPER_ADMIN_MFA="false"
TRUST_PROXY="false"
```

Untuk menghasilkan string acak aman sepanjang 32 karakter pada terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 3. Migrasi Basis Data & Inisialisasi Data
Jalankan migrasi Prisma untuk membuat skema tabel:
```bash
npm run db:migrate -- --name init
```

Lakukan seeding untuk mengisi data dasar dan akun Super Admin:
```bash
npm run db:seed
```
> ⚠️ **PERHATIAN**: Script `npm run db:seed` bersifat destruktif di lingkungan pengembangan (menghapus tabel lalu mengisinya kembali dari `prisma/seed-data.ts`). Di lingkungan produksi, seed hanya dapat berjalan jika `ALLOW_DESTRUCTIVE_SEED=true`.

### 4. Menjalankan Server Pengembangan
```bash
npm run dev
```
Buka browser dan akses:
- **Halaman Publik**: [http://localhost:3000](http://localhost:3000)
- **Halaman Login**: [http://localhost:3000/login](http://localhost:3000/login)
- **Dashboard Admin**: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

---

## 📜 Daftar Perintah (Available Scripts)

| Perintah | Fungsi |
| :--- | :--- |
| `npm run dev` | Menjalankan Next.js development server dengan Turbopack |
| `npm run build` | Membuat production build aplikasi |
| `npm run start` | Menjalankan server aplikasi hasil build produksi |
| `npm run lint` | Menjalankan ESLint untuk pengecekan kualitas kode |
| `npx tsc --noEmit` | Memeriksa integritas tipe TypeScript tanpa kompilasi file |
| `npm run smoke` | Menjalankan smoke test Playwright terhadap build produksi |
| `npm run db:migrate` | Membuat dan menerapkan migrasi basis data baru |
| `npm run db:seed` | Mengisi ulang master data & akun Super Admin |
| `npm run db:studio` | Membuka antarmuka grafis web Prisma Studio |
| `npm run db:reset` | Mereset skema basis data dan menjalankan ulang seed |
| `npx prisma validate` | Memvalidasi sintaks skema `prisma/schema.prisma` |

---

## 🧪 Jaminan Kualitas & Pengujian (Quality Assurance)

Repository ini dilengkapi dengan rangkaian validasi ketat sebelum kode dapat dideploy ke lingkungan produksi:

1. **Type-Safety Penuh**: Bebas dari kesalahan tipe pada `npx tsc --noEmit`.
2. **Standardisasi ESLint**: Mematuhi aturan sintaks dan arsitektur Next.js 16 tanpa peringatan.
3. **Playwright Smoke Testing**:
   ```bash
   npm run smoke
   ```
   Pengujian otomatis ini mencakup:
   - Verifikasi route publik dan SEO header.
   - Pengecekan guard autentikasi dan redirect `/login`.
   - Proses login akun Super Admin.
   - Verifikasi panel dashboard dan hak akses.
   - Operasi mutasi data (update profil dan pengembalian data semula secara terisolasi).

---

## 🛡️ Kebijakan Keamanan (Security Policy)

- **Tidak Ada Inline Scripts / Styles**: Kebijakan CSP menolak semua evaluasi runtime skrip inline tanpa nonce resmi.
- **Sanitasi URL**: Semua tautan eksternal divalidasi dengan fungsi `isSafeLinkUrl` dan `isHttpUrl` dari `utils/url.ts`.
- **Perlindungan Brute Force**: Percobaan login dibatasi per kombinasi email+IP dan per-IP dengan batas waktu bertahap.

---

## 📄 Lisensi (License)

Proyek ini dirilis di bawah lisensi **MIT**. Anda bebas menggunakan, memodifikasi, dan mendistribusikan kode ini untuk kebutuhan komersial maupun non-komersial.

<p align="center">
  Dibuat dengan dedikasi tinggi untuk standar rekayasa perangkat lunak modern.
</p>

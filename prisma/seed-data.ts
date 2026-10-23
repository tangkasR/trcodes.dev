/* Semua isi ngodingan. Tambah ngodingan baru = tambah satu objek di PROJECTS. */

export type Block =
  | { t: "h" | "p" | "quote" | "code" | "note"; x: string }
  | { t: "ul"; x: string[] };

export type Chapter = {
  icon: string;
  title: string;
  slug: string;
  img: string;
  what: string;
  use: string;
  more: string;
  content?: Block[];
};

export type Project = {
  name: string;
  hash: string;
  slug: string;
  isDefault?: boolean;
  short: string;
  desc: string;
  can: string[];
  stack: string[];
  demo: { img: string; video: string };
  chHead: string;
  chapters: Chapter[];
};

export type Job = {
  uuid: string;
  start: string;
  org: string;
  role: string;
  period: string;
  summary: string;
  duties: string[];
  results: string[];
  stack: string[];
};

export type Cert = { title: string; issuer: string; year: string };
export type Edu = { school: string; major: string; years: string };

export const PROJECTS: Record<string, Project> = {
  urm: {
    name: "User Role Management",
    hash: "urm",
    isDefault: true,
    slug: "user-role-management",
    short:
      "Aplikasi untuk mengatur siapa boleh melakukan apa di dalam sebuah sistem.",
    desc: "Admin membuat role, mendaftarkan feature, lalu lewat sebuah matriks menentukan aksi mana (baca, tambah, ubah, hapus) yang boleh dilakukan tiap role pada tiap feature. Setiap user memegang satu role. Izin dicek di server, bukan hanya disembunyikan di tampilan, jadi tidak bisa dilewati dengan mengutak-atik browser.",
    can: [
      "Daftar dan masuk dengan sesi yang aman",
      "Kelola role, feature, dan user",
      "Atur izin per role per feature lewat matriks",
      "Membuat feature atau role baru otomatis menyiapkan izinnya",
      "Fitur note untuk menguji izin langsung",
      "Pencarian dan halaman bertahap di tabel besar",
    ],
    stack: [
      "Next.js",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "Zod",
      "Jose",
      "TanStack Query",
      "Tailwind",
    ],
    demo: { img: "demo-urm", video: "" },
    chHead: "Enam hal yang saya pelajari di dalamnya",
    chapters: [
      {
        icon: "fa-bolt",
        title: "Server Action",
        slug: "server-action",
        img: "trc-action",
        what: "Fungsi yang berjalan di server tetapi dipanggil dari komponen seperti fungsi biasa, tanpa membuat endpoint sendiri.",
        use: "Semua perubahan data (tambah, ubah, hapus) lewat action dengan urutan tetap: cek izin, validasi dengan Zod, panggil service, lalu revalidate.",
        more: "Action terlihat seperti fungsi lokal, padahal pintunya terbuka untuk siapa saja. Karena itu izin dicek di dalamnya.",
      },
      {
        icon: "fa-route",
        title: "Route Handler",
        slug: "route-handler",
        img: "trc-route",
        what: "Endpoint HTTP dengan alamat tetap, cocok untuk membaca data dan untuk aplikasi lain yang perlu memanggil.",
        use: "Dipakai untuk pencarian note dan user lewat GET. Bila belum login atau tidak berhak, ia membalas 401 atau 403 berupa JSON.",
        more: "Aturan siapa boleh melihat note siapa ditulis sekali, lalu dipakai halaman dan endpoint ini.",
      },
      {
        icon: "fa-key",
        title: "Jose dan autentikasi",
        slug: "jose-auth",
        img: "trc-key",
        what: "Jose menandatangani dan memverifikasi JWT yang disimpan di cookie httpOnly, sehingga tidak terbaca oleh JavaScript di browser.",
        use: "Token hanya berisi id user. Hak akses dibaca dari database tiap request, jadi saat role diubah, perubahannya langsung berlaku.",
        more: "Ada satu kompromi yang sengaja diambil: token tidak bisa dicabut sebelum kedaluwarsa.",
      },
      {
        icon: "fa-database",
        title: "Prisma dan PostgreSQL",
        slug: "prisma-postgresql",
        img: "trc-data",
        what: "PostgreSQL menyimpan data, Prisma menerjemahkan antara kode TypeScript dan tabelnya, lengkap dengan migrasi dan seeder.",
        use: "Primary key UUID v7, seeder Super Admin yang aman diulang, dan transaksi supaya membuat feature selalu ikut membuat izin semua role.",
        more: "Menghapus role yang masih dipakai juga ditolak oleh database, bukan hanya oleh kode.",
      },
      {
        icon: "fa-arrows-rotate",
        title: "TanStack Query",
        slug: "tanstack-query",
        img: "trc-query",
        what: "Pengelola data server di browser: menyimpan hasil, menandai data usang, dan mengambil ulang tanpa mengatur loading dan error manual.",
        use: "Dipakai di pencarian note dan user: mengetik ditunda sebentar, hasil lama tetap tampil saat yang baru dimuat, daftar disegarkan setelah perubahan.",
        more: "Tidak semua halaman memakainya, sengaja, supaya dua cara bisa dibandingkan.",
      },
      {
        icon: "fa-layer-group",
        title: "Context",
        slug: "context",
        img: "trc-context",
        what: "Cara React membagikan state ke banyak komponen tanpa mengoper props berlapis.",
        use: "Satu context menyimpan sidebar yang diciutkan, satu lagi daftar izin user untuk menyembunyikan menu dan tombol yang bukan haknya.",
        more: "Menyembunyikan tombol hanya kenyamanan. Kenapa context tidak boleh jadi pengaman, dibahas di bab ini.",
      },
    ],
  },
  pocket: {
    name: "MyPocket",
    hash: "mypocket",
    slug: "mypocket",
    short: "Aplikasi pencatat keuangan pribadi, semua uang di satu tempat.",
    desc: "Uang masuk, uang keluar, tabungan, dan investasi dicatat di satu tempat, lalu diringkas supaya terlihat ke mana uang pergi dan apakah tujuan menabung sudah tercapai.",
    can: [
      "Menabung ke banyak pos sekaligus",
      "Mencatat pemasukan dari berbagai sumber",
      "Mencatat pengeluaran per kategori",
      "Memantau aset investasi",
      "Membaca ringkasan keuangan lewat analisis",
    ],
    stack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Tailwind"],
    demo: { img: "demo-pocket", video: "" },
    chHead: "Lima bagian yang membentuknya",
    chapters: [
      {
        icon: "fa-piggy-bank",
        title: "Multi saving",
        slug: "multi-saving",
        img: "trc-saving",
        what: "Menabung ke banyak pos sekaligus, tiap pos punya nama dan targetnya sendiri.",
        use: "Satu pengguna bisa punya pos seperti dana darurat, liburan, dan gadget, lalu menyisihkan uang ke masing-masing tanpa tercampur.",
        more: "Memindahkan uang antar pos harus tercatat, supaya total tabungan selalu bisa dihitung ulang.",
      },
      {
        icon: "fa-chart-pie",
        title: "Analysis",
        slug: "analysis",
        img: "trc-analysis",
        what: "Mengubah data mentah menjadi gambaran: ke mana uang pergi dan dari mana datangnya.",
        use: "Ringkasan per bulan dan per kategori dari data pemasukan dan pengeluaran, ditampilkan dalam grafik sederhana.",
        more: "Angka yang sama bisa menipu bila dihitung dengan cara berbeda. Bab ini membahas cara menjaganya konsisten.",
      },
      {
        icon: "fa-arrow-trend-down",
        title: "Expense",
        slug: "expense",
        img: "trc-expense",
        what: "Pencatatan uang keluar.",
        use: "Tiap pengeluaran punya tanggal, kategori, dan nominal, dicatat secepat mungkin supaya tidak lupa.",
        more: "Menyimpan uang sebagai angka desimal biasa bisa menghasilkan selisih kecil. Bab ini membahas cara menghindarinya.",
      },
      {
        icon: "fa-arrow-trend-up",
        title: "Income",
        slug: "income",
        img: "trc-income",
        what: "Pencatatan uang masuk dari berbagai sumber.",
        use: "Gaji, pekerjaan sampingan, dan pemasukan lain dicatat terpisah, sehingga terlihat sumber mana yang paling menopang.",
        more: "Pemasukan yang tidak teratur butuh cara baca yang berbeda dari gaji bulanan.",
      },
      {
        icon: "fa-seedling",
        title: "Investment",
        slug: "investment",
        img: "trc-invest",
        what: "Memantau aset investasi dan perkembangan nilainya.",
        use: "Setiap aset dicatat dengan jumlah dan harga belinya, lalu dibandingkan dengan nilai terkini untuk melihat untung atau ruginya.",
        more: "Nilai investasi berubah tiap hari. Bab ini membahas apa yang disimpan dan apa yang dihitung ulang.",
      },
    ],
  },
  ismart: {
    name: "iSmart",
    hash: "ismart",
    slug: "ismart",
    short:
      "School management system: data sekolah, kelas, nilai, dan pembayaran dalam satu aplikasi.",
    desc: "Aplikasi untuk mengelola kegiatan sekolah sehari-hari. Admin, guru, dan wali murid melihat hal yang sama dari sudut pandang berbeda, mulai dari data siswa sampai rapor dan pembayaran.",
    can: [
      "Mengelola data siswa, guru, dan kelas",
      "Mencatat absensi harian",
      "Mengisi nilai dan menyusun rapor",
      "Mengelola tagihan dan pembayaran SPP",
    ],
    stack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Tailwind"],
    demo: { img: "demo-ismart", video: "" },
    chHead: "Empat bagian besar di dalamnya",
    chapters: [
      {
        icon: "fa-users",
        title: "Data siswa dan kelas",
        slug: "siswa-kelas",
        img: "is-siswa",
        what: "Fondasi semua fitur lain: siapa siswanya, di kelas mana, dan siapa wali kelasnya.",
        use: "Siswa berpindah kelas tiap tahun ajaran tanpa menghilangkan riwayatnya.",
        more: "Relasi siswa, kelas, dan tahun ajaran adalah bagian tersulit untuk dirancang.",
      },
      {
        icon: "fa-calendar-check",
        title: "Absensi",
        slug: "absensi",
        img: "is-absen",
        what: "Pencatatan kehadiran siswa tiap hari.",
        use: "Guru mengisi absensi per kelas, dan rekapnya otomatis terbaca di rapor.",
        more: "Absensi diisi serentak di jam yang sama, jadi beban sistemnya perlu dipikirkan.",
      },
      {
        icon: "fa-file-lines",
        title: "Nilai dan rapor",
        slug: "nilai-rapor",
        img: "is-nilai",
        what: "Pengisian nilai per mata pelajaran lalu dirangkum menjadi rapor.",
        use: "Guru hanya bisa mengisi nilai mata pelajaran yang diajarnya.",
        more: "Rapor yang sudah dicetak tidak boleh berubah diam-diam, ada aturannya.",
      },
      {
        icon: "fa-wallet",
        title: "Pembayaran SPP",
        slug: "pembayaran-spp",
        img: "is-spp",
        what: "Tagihan bulanan dan pencatatan pembayarannya.",
        use: "Tagihan dibuat otomatis tiap bulan, dan status lunas terlihat oleh wali murid.",
        more: "Uang menuntut ketelitian ekstra, mulai dari pembulatan sampai pembayaran ganda.",
      },
    ],
  },
  wedding: {
    name: "Wedding Invitation",
    hash: "wedding",
    slug: "wedding-invitation",
    short: "Undangan pernikahan digital yang dibagikan lewat satu tautan.",
    desc: "Undangan yang bisa dibuka dari ponsel, lengkap dengan lokasi, galeri foto, konfirmasi kehadiran, dan kolom ucapan dari para tamu.",
    can: [
      "Menampilkan undangan dengan nama tamu",
      "Konfirmasi kehadiran (RSVP)",
      "Galeri foto pasangan",
      "Kolom ucapan dan doa",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind", "Prisma", "PostgreSQL"],
    demo: { img: "demo-wedding", video: "" },
    chHead: "Empat bagian undangannya",
    chapters: [
      {
        icon: "fa-envelope-open-text",
        title: "Undangan digital",
        slug: "undangan-digital",
        img: "wd-undangan",
        what: "Halaman undangan yang tampil personal untuk tiap tamu.",
        use: "Satu tautan per tamu, nama mereka muncul di bagian pembuka.",
        more: "Nama tamu di alamat tautan perlu ditangani dengan hati-hati.",
      },
      {
        icon: "fa-clipboard-check",
        title: "RSVP",
        slug: "rsvp",
        img: "wd-rsvp",
        what: "Konfirmasi hadir atau tidak dari tamu.",
        use: "Tamu memilih hadir dan jumlah orang, pengantin melihat rekapnya.",
        more: "Kenapa satu tamu tidak boleh mengirim konfirmasi berkali-kali.",
      },
      {
        icon: "fa-images",
        title: "Galeri",
        slug: "galeri",
        img: "wd-galeri",
        what: "Kumpulan foto pasangan.",
        use: "Foto dimuat bertahap supaya undangan tetap ringan dibuka di ponsel.",
        more: "Gambar yang berat adalah musuh utama halaman undangan.",
      },
      {
        icon: "fa-comments",
        title: "Ucapan dan doa",
        slug: "ucapan",
        img: "wd-ucapan",
        what: "Kolom tempat tamu menulis ucapan.",
        use: "Ucapan tampil langsung di halaman, dengan batasan panjang dan penyaringan isi.",
        more: "Kolom yang bisa diisi siapa saja selalu perlu dijaga.",
      },
    ],
  },
};

/* Isi lengkap contoh untuk satu bab (halaman detail). Bab lain tampil dengan ringkasannya. */
PROJECTS.urm.chapters[0].content = [
  { t: "h", x: "Masalahnya dulu" },
  {
    t: "p",
    x: "Di User Role Management, setiap tombol Tambah, Ubah, dan Hapus harus berujung pada perubahan data di server. Cara lama: membuat endpoint API, memanggilnya dengan fetch, lalu mengurus status loading dan error sendiri. Untuk puluhan operasi, itu berulang dan mudah salah.",
  },
  { t: "h", x: "Apa yang dilakukan server action" },
  {
    t: "p",
    x: 'Server action adalah fungsi async yang diberi penanda "use server". Kamu memanggilnya dari komponen seperti fungsi biasa, sementara framework yang mengurus pengiriman datanya. Tidak ada alamat endpoint yang ditulis, dan tipe argumen serta hasilnya ikut terbawa ke komponen.',
  },
  {
    t: "quote",
    x: "Terlihat seperti fungsi lokal, padahal ia pintu yang terbuka untuk siapa saja.",
  },
  { t: "h", x: "Urutan yang selalu sama di ngodingan ini" },
  {
    t: "p",
    x: "Setiap action mengikuti empat langkah yang sama, sehingga mudah dibaca dan mudah diperiksa:",
  },
  {
    t: "code",
    x: 'export async function deleteNoteAction(uuid: string) {\n  return handleAction(async () => {\n    const session = await requirePermission("note", "delete"); // 1. izin\n    const noteId = parseInput(idSchema, id);                  // 2. validasi\n    await deleteNote(toActor(session), noteId);               // 3. service\n    revalidatePath("/notes");                                 // 4. revalidate\n  }, "Note berhasil dihapus");\n}',
  },
  {
    t: "p",
    x: "Izin dicek paling awal, sebelum validasi, supaya pengguna tanpa hak tidak bisa memancing pesan validasi dari server.",
  },
  { t: "h", x: "Jebakan yang saya temui" },
  {
    t: "ul",
    x: [
      "Mengira action aman karena hanya dipanggil dari tombol. Siapa pun bisa memanggilnya langsung, jadi izin wajib dicek di dalamnya.",
      "Melempar error ke komponen. Di produksi pesannya disamarkan, jadi hasilnya dibungkus menjadi objek berstatus berhasil atau gagal.",
      "Lupa me-revalidate halaman yang ikut terdampak, misalnya sidebar yang bergantung pada izin.",
    ],
  },
  { t: "h", x: "Ringkasnya" },
  {
    t: "p",
    x: "Server action mengurangi kode penghubung antara tampilan dan database, tetapi tidak mengurangi tanggung jawab keamanan. Anggap ia endpoint publik yang kebetulan nyaman dipanggil.",
  },
];

/* Pengalaman kerja (contoh). Urutan: terbaru dulu. */
export const JOBS: Job[] = [
  {
    uuid: "ais-technology-asia",
    start: "2024",
    org: "PT Ais Technology Asia",
    role: "Full Stack Developer",
    period: "Oktober 2024 sampai sekarang",
    summary:
      "Membangun dan merawat aplikasi web dari ujung ke ujung bersama tim.",
    duties: [
      "Merancang dan membangun fitur aplikasi web dari ujung ke ujung",
      "Menulis alur otorisasi berbasis role dan permission",
      "Melakukan code review dan mendokumentasikan keputusan teknis",
    ],
    results: [
      "Fitur baru dirilis bertahap dan stabil",
      "Dokumentasi teknis yang bisa dipakai anggota tim baru",
    ],
    stack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Tailwind"],
  },
  {
    uuid: "nazma-office",
    start: "2024",
    org: "Nazma Office",
    role: "Web Developer",
    period: "Januari 2024",
    summary:
      "Mengerjakan satu situs untuk kebutuhan kantor dalam waktu singkat.",
    duties: [
      "Menyusun halaman situs yang responsif",
      "Menyiapkan formulir dan pengelolaan konten sederhana",
      "Menyerahkan hasilnya beserta panduan penggunaan",
    ],
    results: [
      "Situs selesai dan diserahkan sesuai tenggat",
      "Pengelola kantor bisa memperbarui konten sendiri",
    ],
    stack: ["HTML", "CSS", "JavaScript", "Laravel"],
  },
  {
    uuid: "dicoding-indonesia",
    start: "2023",
    org: "Dicoding Indonesia",
    role: "Web Developer (program belajar)",
    period: "Juli sampai Desember 2023",
    summary:
      "Belajar dan mengerjakan latihan pengembangan web secara terstruktur selama enam bulan.",
    duties: [
      "Mengikuti materi front-end, back-end, dan basis data",
      "Mengerjakan tugas akhir di setiap kelas",
      "Menerima ulasan dari reviewer lalu memperbaikinya",
    ],
    results: [
      "Tugas akhir lolos ulasan",
      "Memperoleh sejumlah sertifikat kelas",
    ],
    stack: ["JavaScript", "React", "Node.js", "SQL"],
  },
];

/* Sertifikasi (contoh, ganti dengan yang asli) */
export const CERTS: Cert[] = [
  {
    title: "Belajar Dasar Pemrograman Web",
    issuer: "Dicoding Indonesia",
    year: "2023",
  },
  {
    title: "Belajar Fundamental Aplikasi Web dengan React",
    issuer: "Dicoding Indonesia",
    year: "2023",
  },
  {
    title: "Belajar Back-End untuk Pemula",
    issuer: "Dicoding Indonesia",
    year: "2023",
  },
  {
    title: "Belajar Dasar Git dengan GitHub",
    issuer: "Dicoding Indonesia",
    year: "2023",
  },
  { title: "Belajar Dasar SQL", issuer: "Dicoding Indonesia", year: "2023" },
  { title: "Dasar Pemrograman Python", issuer: "Kursus daring", year: "2024" },
  { title: "TypeScript Fundamentals", issuer: "Kursus daring", year: "2024" },
  {
    title: "PostgreSQL untuk Developer",
    issuer: "Kursus daring",
    year: "2024",
  },
  {
    title: "Dasar Keamanan Aplikasi Web",
    issuer: "Kursus daring",
    year: "2024",
  },
  { title: "Dasar UI dan UX Design", issuer: "Kursus daring", year: "2022" },
];

/* Pendidikan (contoh) */
export const EDU: Edu[] = [
  {
    school: "Universitas Atma Jaya Yogyakarta",
    major: "Informatika",
    years: "2020-2024",
  },
  { school: "SMA Negeri 5 Purwokerto", major: "MIPA", years: "2017-2020" },
];

/* Kontak. Ganti url dan teks dengan akun aslimu. */
export const CONTACTS: [
  icon: string,
  name: string,
  href: string,
  text: string
][] = [
  [
    "fa-regular fa-envelope",
    "Email",
    "mailto:email@domainmu.com",
    "email@domainmu.com",
  ],
  [
    "fa-brands fa-whatsapp",
    "WhatsApp",
    "https://wa.me/62XXXXXXXXXX",
    "+62 xxx",
  ],
  [
    "fa-brands fa-instagram",
    "Instagram",
    "https://instagram.com/username",
    "@username",
  ],
  [
    "fa-brands fa-github",
    "GitHub",
    "https://github.com/username",
    "github.com/username",
  ],
  [
    "fa-brands fa-linkedin",
    "LinkedIn",
    "https://linkedin.com/in/username",
    "in/username",
  ],
];

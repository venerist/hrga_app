# 🚀 HRGA System — Panduan Deploy ke Vercel + Supabase

## LANGKAH 1: Setup Supabase (Database)

1. Buka https://supabase.com → **New Project**
2. Isi nama project, password database, pilih region **Southeast Asia (Singapore)**
3. Tunggu project siap (~2 menit)
4. Buka **SQL Editor** → klik **New Query**
5. Copy-paste isi file `supabase_schema.sql` → klik **Run**
6. Buka **Project Settings → API**:
   - Copy **Project URL** → simpan
   - Copy **anon public key** → simpan
   - Copy **service_role key** → simpan (RAHASIA, jangan share)

---

## LANGKAH 2: Siapkan Kode di GitHub

1. Buat akun GitHub jika belum punya: https://github.com
2. Buat repository baru → nama: `hrga-system` → **Public** atau **Private**
3. Upload semua file dari folder `hrga-app` ini ke repository tersebut
   - Cara termudah: drag-drop semua file ke GitHub web editor
   - Pastikan TIDAK mengupload folder `node_modules` dan file `.env.local`

---

## LANGKAH 3: Deploy ke Vercel

1. Buka https://vercel.com → login dengan akun GitHub
2. Klik **Add New Project**
3. Pilih repository `hrga-system` → klik **Import**
4. Di bagian **Environment Variables**, tambahkan 3 variabel:

   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | URL dari Supabase (Langkah 1) |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key dari Supabase |
   | `SUPABASE_SERVICE_ROLE_KEY` | service_role key dari Supabase |

5. Klik **Deploy** → tunggu ~2-3 menit
6. Selesai! Vercel akan memberi URL seperti: `https://hrga-system-xxx.vercel.app`

---

## LANGKAH 4: Test Aplikasi

1. Buka URL yang diberikan Vercel
2. Login dengan:
   - Username: `admin`, Password: `hrga2024`
   - Username: `hr`, Password: `hr1234`
3. Coba upload file fingerprint `.xls` dari mesin fingerprint
4. Data akan tersimpan otomatis ke Supabase

---

## Cara Update Kode (setelah deploy pertama)

Setiap kali kamu update file di GitHub, Vercel akan otomatis **re-deploy** dalam ~1-2 menit. Tidak perlu apa-apa lagi.

---

## Mengganti Password Login

Edit file `app/login/page.tsx`, cari bagian:

```javascript
const USERS: Record<string, string> = {
  admin: 'hrga2024',
  hr: 'hr1234',
}
```

Ganti password sesuai keinginan, lalu push ke GitHub.

---

## Struktur File

```
hrga-app/
├── app/
│   ├── layout.tsx          ← Layout utama
│   ├── page.tsx            ← Redirect ke login/dashboard
│   ├── globals.css         ← Design system CSS
│   ├── login/page.tsx      ← Halaman login
│   └── dashboard/
│       ├── layout.tsx      ← Auth guard + sidebar
│       ├── page.tsx        ← Dashboard home
│       ├── payroll/        ← Upload fingerprint & absensi
│       ├── rekrutmen/      ← Pipeline rekrutmen
│       ├── cuti/           ← Manajemen cuti
│       ├── kpi/            ← Penilaian KPI
│       └── ga/             ← General Affairs
├── components/
│   └── Sidebar.tsx         ← Navigasi sidebar
├── lib/
│   ├── supabase.ts         ← Koneksi database
│   └── fingerprint.ts      ← Logika proses data absensi
├── supabase_schema.sql     ← Script database (jalankan di Supabase)
└── .env.local              ← Variabel environment (JANGAN diupload ke GitHub)
```

---

## ⚠️ PENTING

- File `.env.local` berisi API key rahasia — **JANGAN** diupload ke GitHub
- Tambahkan `.env.local` ke file `.gitignore` (sudah otomatis ada di Next.js)
- Untuk production, pertimbangkan menggunakan auth yang lebih secure (NextAuth / Supabase Auth)

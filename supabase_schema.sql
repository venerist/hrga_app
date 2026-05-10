-- =============================================
-- HRGA SYSTEM — Supabase Schema
-- Jalankan ini di Supabase SQL Editor
-- =============================================

-- ABSENSI (hasil proses fingerprint)
create table if not exists absensi (
  id uuid default gen_random_uuid() primary key,
  departemen text,
  nama text not null,
  no_id text,
  tanggal date not null,
  jam_masuk timestamptz,
  jam_keluar timestamptz,
  jam_masuk_str text,
  jam_keluar_str text,
  durasi_jam numeric,
  shift text,
  menit_terlambat integer default 0,
  jml_tap integer default 1,
  status text,
  periode text, -- contoh: "2026-03"
  created_at timestamptz default now()
);

-- REKRUTMEN
create table if not exists rekrutmen (
  id uuid default gen_random_uuid() primary key,
  nama text not null,
  posisi text not null,
  tgl_melamar date,
  status text default 'Screening',
  catatan text,
  created_at timestamptz default now()
);

-- CUTI & IZIN
create table if not exists cuti (
  id uuid default gen_random_uuid() primary key,
  nama text not null,
  jenis text,
  tgl_mulai date,
  tgl_selesai date,
  durasi_hari integer,
  alasan text,
  status text default 'Pending',
  created_at timestamptz default now()
);

-- KPI
create table if not exists kpi (
  id uuid default gen_random_uuid() primary key,
  nama text not null,
  periode text,
  target numeric,
  realisasi numeric,
  capaian numeric,
  predikat text,
  catatan text,
  created_at timestamptz default now()
);

-- GENERAL AFFAIRS
create table if not exists ga (
  id uuid default gen_random_uuid() primary key,
  pemohon text not null,
  kategori text,
  deskripsi text,
  prioritas text default 'Normal',
  tanggal date,
  status text default 'Open',
  created_at timestamptz default now()
);

-- RLS (Row Level Security) — aktifkan semua tabel
alter table absensi enable row level security;
alter table rekrutmen enable row level security;
alter table cuti enable row level security;
alter table kpi enable row level security;
alter table ga enable row level security;

-- Policy: allow all (pakai service role key di backend, bukan anon)
create policy "allow all absensi"   on absensi   for all using (true) with check (true);
create policy "allow all rekrutmen" on rekrutmen  for all using (true) with check (true);
create policy "allow all cuti"      on cuti       for all using (true) with check (true);
create policy "allow all kpi"       on kpi        for all using (true) with check (true);
create policy "allow all ga"        on ga         for all using (true) with check (true);

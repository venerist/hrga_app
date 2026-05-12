-- =============================================
-- HRGA SYSTEM — Enhanced Enterprise Schema
-- Compatible with Supabase (PostgreSQL)
-- =============================================

-- ============ CORE TABLES ============

-- Departments
CREATE TABLE IF NOT EXISTS departments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama TEXT UNIQUE NOT NULL,
  manager TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Employees master data
CREATE TABLE IF NOT EXISTS employees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  no_id TEXT UNIQUE,
  nama TEXT NOT NULL,
  email TEXT,
  departemen TEXT REFERENCES departments(nama),
  jabatan TEXT,
  tgl_masuk DATE,
  status TEXT DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Non-Aktif', 'Resign')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Users & Authentication
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('admin', 'hr_manager', 'hr_staff', 'viewer')),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Roles (extensible permissions)
CREATE TABLE IF NOT EXISTS roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  permissions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============ MODULE TABLES ============

-- ABSENSI (hasil proses fingerprint)
CREATE TABLE IF NOT EXISTS absensi (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  departemen TEXT,
  nama TEXT NOT NULL,
  no_id TEXT,
  tanggal DATE NOT NULL,
  jam_masuk TIMESTAMPTZ,
  jam_keluar TIMESTAMPTZ,
  jam_masuk_str TEXT,
  jam_keluar_str TEXT,
  durasi_jam NUMERIC,
  shift TEXT,
  menit_terlambat INTEGER DEFAULT 0,
  jml_tap INTEGER DEFAULT 1,
  status TEXT,
  periode TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- REKRUTMEN
CREATE TABLE IF NOT EXISTS rekrutmen (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama TEXT NOT NULL,
  posisi TEXT NOT NULL,
  tgl_melamar DATE,
  status TEXT DEFAULT 'Screening',
  catatan TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- CUTI & IZIN
CREATE TABLE IF NOT EXISTS cuti (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama TEXT NOT NULL,
  jenis TEXT,
  tgl_mulai DATE,
  tgl_selesai DATE,
  durasi_hari INTEGER,
  alasan TEXT,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- KPI
CREATE TABLE IF NOT EXISTS kpi (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama TEXT NOT NULL,
  periode TEXT,
  target NUMERIC,
  realisasi NUMERIC,
  capaian NUMERIC,
  predikat TEXT,
  catatan TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- GENERAL AFFAIRS
CREATE TABLE IF NOT EXISTS ga (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pemohon TEXT NOT NULL,
  kategori TEXT,
  deskripsi TEXT,
  prioritas TEXT DEFAULT 'Normal',
  tanggal DATE,
  status TEXT DEFAULT 'Open',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============ AUDIT & SECURITY ============

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  user_email TEXT,
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============ ROW LEVEL SECURITY ============

ALTER TABLE absensi ENABLE ROW LEVEL SECURITY;
ALTER TABLE rekrutmen ENABLE ROW LEVEL SECURITY;
ALTER TABLE cuti ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi ENABLE ROW LEVEL SECURITY;
ALTER TABLE ga ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policies (service role key bypasses RLS)
CREATE POLICY "allow all absensi"    ON absensi    FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow all rekrutmen"  ON rekrutmen  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow all cuti"       ON cuti       FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow all kpi"        ON kpi        FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow all ga"         ON ga         FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow all departments" ON departments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow all employees"  ON employees  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow all users"      ON users      FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow all audit_logs" ON audit_logs FOR ALL USING (true) WITH CHECK (true);

-- ============ INDEXES ============

CREATE INDEX IF NOT EXISTS idx_absensi_periode ON absensi(periode);
CREATE INDEX IF NOT EXISTS idx_absensi_nama ON absensi(nama);
CREATE INDEX IF NOT EXISTS idx_absensi_tanggal ON absensi(tanggal);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_employees_departemen ON employees(departemen);

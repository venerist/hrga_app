-- =============================================
-- VENERIS HRIS — Database Schema V2 (Simplified Master)
-- Run this in Supabase SQL Editor
-- =============================================

-- =============================================
-- 1. MASTER EMPLOYEE
-- =============================================
create table if not exists employees (
  id uuid default gen_random_uuid() primary key,
  nik text unique not null,
  name text not null,
  division text,
  position text,
  status text default 'Active', -- Active/Inactive
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================
-- 2. ATTENDANCE SYSTEM
-- =============================================
create table if not exists attendance_import_batches (
  id uuid default gen_random_uuid() primary key,
  file_name text not null,
  uploaded_by uuid, -- Supabase auth user id
  upload_date timestamptz default now(),
  total_records integer default 0,
  status text default 'Completed'
);

create table if not exists attendance_raw (
  id uuid default gen_random_uuid() primary key,
  employee_nik text references employees(nik) on update cascade,
  attendance_date date not null,
  check_in timestamptz,
  check_out timestamptz,
  batch_id uuid references attendance_import_batches(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists attendance_summary (
  id uuid default gen_random_uuid() primary key,
  employee_nik text references employees(nik) on update cascade,
  date date not null,
  status text, -- Present, Late, Early Leave, Absent, Leave, Sick, etc.
  late_minutes integer default 0,
  overtime_minutes integer default 0,
  work_hours numeric default 0,
  updated_at timestamptz default now(),
  unique(employee_nik, date)
);

-- =============================================
-- 3. LEAVE SYSTEM
-- =============================================
create table if not exists leave_types (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category text,
  is_paid boolean default true,
  affect_attendance boolean default true
);

-- Insert Default Leave Types
insert into leave_types (name, category, is_paid, affect_attendance) values
  ('CUTI REGULER', 'Annual', true, true),
  ('CUTI MELAHIRKAN', 'Maternity', true, true),
  ('SAKIT DENGAN SURAT DOKTER', 'Sick', true, true),
  ('SAKIT TANPA SURAT DOKTER', 'Sick', false, true),
  ('IJIN SETENGAH HARI', 'Permit', false, true),
  ('PERNIKAHAN', 'Special', true, true),
  ('KELUARGA MENINGGAL', 'Special', true, true),
  ('DINAS LUAR', 'Business', true, true)
on conflict do nothing;

create table if not exists leave_requests (
  id uuid default gen_random_uuid() primary key,
  employee_nik text references employees(nik) on update cascade,
  leave_type_id uuid references leave_types(id),
  start_date date not null,
  end_date date not null,
  status text default 'Pending', -- Draft, Pending, Approved, Rejected
  approved_by uuid, -- Supabase auth user id
  approved_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists attendance_overrides (
  id uuid default gen_random_uuid() primary key,
  employee_nik text references employees(nik) on update cascade,
  date date not null,
  leave_request_id uuid references leave_requests(id) on delete cascade,
  old_status text,
  new_status text not null,
  created_at timestamptz default now(),
  unique(employee_nik, date)
);

-- =============================================
-- 4. PAYROLL SYSTEM
-- =============================================
create table if not exists payroll_periods (
  id uuid default gen_random_uuid() primary key,
  month integer not null,
  year integer not null,
  status text default 'Open', -- Open, Processing, Approved, Closed
  created_at timestamptz default now(),
  unique(month, year)
);

create table if not exists payroll_details (
  id uuid default gen_random_uuid() primary key,
  period_id uuid references payroll_periods(id) on delete cascade,
  employee_nik text references employees(nik) on update cascade,
  base_salary numeric default 0,
  attendance_deduction numeric default 0,
  overtime_pay numeric default 0,
  bpjs numeric default 0,
  tax_pph21 numeric default 0,
  net_salary numeric default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(period_id, employee_nik)
);

-- =============================================
-- ENABLE RLS & POLICIES
-- =============================================
alter table employees enable row level security;
alter table attendance_import_batches enable row level security;
alter table attendance_raw enable row level security;
alter table attendance_summary enable row level security;
alter table leave_types enable row level security;
alter table leave_requests enable row level security;
alter table attendance_overrides enable row level security;
alter table payroll_periods enable row level security;
alter table payroll_details enable row level security;

-- Create policies (Backend operates primarily with Service Role Key for now)
create policy "allow all employees" on employees for all using (true) with check (true);
create policy "allow all attendance_import_batches" on attendance_import_batches for all using (true) with check (true);
create policy "allow all attendance_raw" on attendance_raw for all using (true) with check (true);
create policy "allow all attendance_summary" on attendance_summary for all using (true) with check (true);
create policy "allow all leave_types" on leave_types for all using (true) with check (true);
create policy "allow all leave_requests" on leave_requests for all using (true) with check (true);
create policy "allow all attendance_overrides" on attendance_overrides for all using (true) with check (true);
create policy "allow all payroll_periods" on payroll_periods for all using (true) with check (true);
create policy "allow all payroll_details" on payroll_details for all using (true) with check (true);

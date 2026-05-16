-- =============================================
-- ATTENDANCE IMPORT & HOLIDAYS SYSTEM
-- =============================================

-- 1. National Holidays Table
create table if not exists national_holidays (
  id uuid default gen_random_uuid() primary key,
  date date unique not null,
  name text not null,
  is_official boolean default true,
  created_at timestamptz default now()
);

-- 2. Audit Logs Table
create table if not exists audit_logs (
  id uuid default gen_random_uuid() primary key,
  action text not null,
  metadata jsonb default '{}'::jsonb,
  user_id uuid references auth.users(id),
  created_at timestamptz default now()
);

-- 3. Attendance Import Errors Table
create table if not exists attendance_import_errors (
  id uuid default gen_random_uuid() primary key,
  batch_id uuid references attendance_import_batches(id) on delete cascade,
  row_data jsonb not null,
  error_message text not null,
  created_at timestamptz default now()
);

-- 4. Update Attendance Import Batches Table
alter table attendance_import_batches add column if not exists month integer;
alter table attendance_import_batches add column if not exists year integer;
alter table attendance_import_batches add column if not exists valid_rows integer default 0;
alter table attendance_import_batches add column if not exists invalid_rows integer default 0;
alter table attendance_import_batches add column if not exists matched_employees integer default 0;
alter table attendance_import_batches add column if not exists unmatched_rows integer default 0;

-- 5. Attendance Records Table (Main Scan Table)
-- We use this instead of attendance_raw or in addition to it. 
-- The user requested attendance_records.
create table if not exists attendance_records (
  id uuid default gen_random_uuid() primary key,
  employee_nik text references employees(nik) on update cascade,
  attendance_date date not null,
  scan_time timestamptz not null,
  batch_id uuid references attendance_import_batches(id) on delete set null,
  created_at timestamptz default now(),
  unique(employee_nik, scan_time)
);

-- 6. Enable RLS
alter table national_holidays enable row level security;
alter table audit_logs enable row level security;
alter table attendance_import_errors enable row level security;
alter table attendance_records enable row level security;

-- 7. Policies
create policy "allow all national_holidays" on national_holidays for all using (true) with check (true);
create policy "allow all audit_logs" on audit_logs for all using (true) with check (true);
create policy "allow all attendance_import_errors" on attendance_import_errors for all using (true) with check (true);
create policy "allow all attendance_records" on attendance_records for all using (true) with check (true);

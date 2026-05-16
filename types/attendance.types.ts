import type { BadgeConfig } from './common.types'

export interface RawFingerprintRecord {
  'Nama'?: string
  'Tgl/Waktu'?: string | Date
  'Departemen'?: string
  'No.ID'?: string
  [key: string]: unknown
}

export type AbsensiStatus =
  | 'Present'
  | 'Terlambat'
  | 'Pulang Cepat'
  | 'Sakit'
  | 'Izin'
  | 'Absent'
  | 'Leave'
  | 'Business'
  | 'Permit'
  | 'Tap Masuk'
  | 'Tap Keluar'
  | 'Shift'
  | 'Tepat Waktu'

export interface Absensi {
  id: string
  departemen: string
  nama: string
  no_id: string
  tanggal: string
  jam_masuk: string
  jam_keluar: string
  jam_masuk_str: string
  jam_keluar_str: string
  durasi_jam: number | null
  shift: string
  menit_terlambat: number
  jml_tap: number
  status: AbsensiStatus
  periode: string
  created_at: string
}

export interface RekapKaryawan {
  nama: string
  departemen: string
  hari_hadir: number
  tidak_hadir: number
  pct_kehadiran: number
  terlambat: number
  tap_1x: number
  total_mnt_telat: number
  avg_jam: number
}

export interface AttendanceStats {
  totalDays: number
  totalLate: number
  totalAbsent: number
  totalOvertime: number
}

export interface AttendanceImportBatch {
  id: string
  file_name: string
  uploaded_by: string | null
  upload_date: string
  total_records: number
  month: number
  year: number
  valid_rows: number
  invalid_rows: number
  matched_employees: number
  unmatched_rows: number
  status: 'Pending' | 'Processing' | 'Completed' | 'Failed'
}

export interface AttendanceImportError {
  id: string
  batch_id: string
  row_data: Record<string, any>
  error_message: string
  created_at: string
}

export interface NationalHoliday {
  id: string
  holiday_date: string
  name: string
  is_official: boolean
  created_at: string
}

export interface AuditLog {
  id: string
  action: string
  metadata: Record<string, any>
  user_id: string | null
  created_at: string
}

export interface AttendanceRecord {
  id: string
  employee_nik: string
  attendance_date: string
  scan_time: string
  batch_id: string | null
  created_at: string
}

export interface AttendanceRaw {
  id: string
  employee_nik: string
  attendance_date: string
  check_in: string | null
  check_out: string | null
  batch_id: string | null
  created_at: string
}

export interface AttendanceSummary {
  id: string
  employee_nik: string
  attendance_date: string
  status: AbsensiStatus
  late_minutes: number
  overtime_minutes: number
  work_hours: number
  check_in: string | null
  check_out: string | null
  updated_at: string
}

export interface AttendanceOverride {
  id: string
  employee_nik: string
  attendance_date: string
  leave_request_id: string | null
  old_status: string | null
  new_status: string
  created_at: string
}

export const ABSENSI_STATUS_BADGE: Record<AbsensiStatus, BadgeConfig> = {
  'Present':       { className: 'badge-green' },
  'Terlambat':     { className: 'badge-orange' },
  'Pulang Cepat':  { className: 'badge-amber' },
  'Sakit':         { className: 'badge-red' },
  'Izin':          { className: 'badge-blue' },
  'Absent':        { className: 'badge-gray' },
  'Leave':         { className: 'badge-blue' },
  'Business':      { className: 'badge-cyan' },
  'Permit':        { className: 'badge-yellow' },
  'Tap Masuk':     { className: 'badge-yellow' },
  'Tap Keluar':    { className: 'badge-yellow' },
  'Shift':         { className: 'badge-blue' },
  'Tepat Waktu':   { className: 'badge-green' },
}

export const ATTENDANCE_CONSTANTS = {
  JAM_MASUK_STD: 8 * 60, // 08:00 in minutes
  TOLERANSI: 5,
}

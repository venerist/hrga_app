// Attendance domain types — replaces inline `any[]` usage in payroll and dashboard pages

import type { BaseEntity, BadgeConfig } from './common.types'

/** Raw fingerprint record from Excel upload */
export interface RawFingerprintRecord {
  Departemen?: string
  Nama: string
  'No.ID'?: string
  'Tgl/Waktu': string
}

/** Processed attendance record stored in Supabase */
export interface Absensi extends BaseEntity {
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
}

export type AbsensiStatus = 'Tepat Waktu' | 'Terlambat' | 'Tap Masuk' | 'Tap Keluar' | 'Shift'

/** Per-employee attendance summary (rekap) */
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

/** Dashboard stats derived from attendance data */
export interface AttendanceStats {
  totalKaryawan: number
  hariKerja: number
  terlambat: number
  tap1x: number
  totalMntTelat: number
  periodeLabel: string
}

/** Badge config for attendance status */
export const ABSENSI_STATUS_BADGE: Record<AbsensiStatus, BadgeConfig> = {
  'Tepat Waktu': { className: 'badge-green', emoji: '✅' },
  'Terlambat':   { className: 'badge-red',   emoji: '⚠️' },
  'Tap Masuk':   { className: 'badge-yellow', emoji: '🟡' },
  'Tap Keluar':  { className: 'badge-yellow', emoji: '🟡' },
  'Shift':       { className: 'badge-blue',   emoji: '🌙' },
}

/** Attendance processing constants */
export const ATTENDANCE_CONSTANTS = {
  JAM_MASUK_STD: 8 * 60,  // 08:00 in minutes
  TOLERANSI: 5,            // 5-minute late tolerance
  TERLAMBAT_BERAT: 30,     // >30 min = severe lateness
} as const

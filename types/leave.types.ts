// Leave (Cuti) domain types

import type { BaseEntity, BadgeConfig } from './common.types'

export type CutiStatus = 'Draft' | 'Pending' | 'Approved' | 'Rejected'

export type CutiJenis =
  | 'CUTI REGULER'
  | 'CUTI MELAHIRKAN'
  | 'SAKIT DENGAN SURAT DOKTER'
  | 'SAKIT TANPA SURAT DOKTER'
  | 'IJIN SETENGAH HARI'
  | 'DATANG TERLAMBAT'
  | 'PULANG CEPAT'
  | 'PERNIKAHAN KARYAWAN'
  | 'KELUARGA MENINGGAL'
  | 'DINAS LUAR KOTA'
  | 'CUTI TIDAK DIBAYAR'
  | 'DLL'

export interface LeaveType extends BaseEntity {
  name: CutiJenis
  category: string
  is_paid: boolean
  affect_attendance: boolean
}

export interface LeaveRequest extends BaseEntity {
  nama: string
  jenis: string
  tgl_mulai: string
  tgl_selesai: string
  durasi_hari: number
  alasan: string
  status: CutiStatus
}

export interface LeaveRequestInsert {
  nama: string
  jenis: string
  tgl_mulai: string
  tgl_selesai: string
  durasi_hari: number
  alasan: string
  status: CutiStatus
}

export type Cuti = LeaveRequest
export type CutiInsert = LeaveRequestInsert

export const CUTI_JENIS_OPTIONS: CutiJenis[] = [
  'CUTI REGULER',
  'CUTI MELAHIRKAN',
  'SAKIT DENGAN SURAT DOKTER',
  'SAKIT TANPA SURAT DOKTER',
  'IJIN SETENGAH HARI',
  'DATANG TERLAMBAT',
  'PULANG CEPAT',
  'PERNIKAHAN KARYAWAN',
  'KELUARGA MENINGGAL',
  'DINAS LUAR KOTA',
  'CUTI TIDAK DIBAYAR',
  'DLL',
]

export const CUTI_STATUS_OPTIONS: CutiStatus[] = ['Draft', 'Pending', 'Approved', 'Rejected']

export const CUTI_JENIS_BADGE: Record<CutiJenis, BadgeConfig> = {
  'CUTI REGULER':                 { className: 'badge-blue' },
  'CUTI MELAHIRKAN':              { className: 'badge-orange' },
  'SAKIT DENGAN SURAT DOKTER':    { className: 'badge-red' },
  'SAKIT TANPA SURAT DOKTER':     { className: 'badge-red' },
  'IJIN SETENGAH HARI':           { className: 'badge-yellow' },
  'DATANG TERLAMBAT':             { className: 'badge-amber' },
  'PULANG CEPAT':                 { className: 'badge-amber' },
  'PERNIKAHAN KARYAWAN':          { className: 'badge-pink' },
  'KELUARGA MENINGGAL':           { className: 'badge-gray' },
  'DINAS LUAR KOTA':              { className: 'badge-cyan' },
  'CUTI TIDAK DIBAYAR':           { className: 'badge-slate' },
  'DLL':                          { className: 'badge-black' },
}

export const CUTI_STATUS_BADGE: Record<CutiStatus, BadgeConfig> = {
  Draft:    { className: 'badge-gray' },
  Pending:  { className: 'badge-yellow' },
  Approved: { className: 'badge-green' },
  Rejected: { className: 'badge-red' },
}

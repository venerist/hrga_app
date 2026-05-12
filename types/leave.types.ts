// Leave (Cuti) domain types

import type { BaseEntity, BadgeConfig } from './common.types'

export interface Cuti extends BaseEntity {
  nama: string
  jenis: CutiJenis
  tgl_mulai: string
  tgl_selesai: string
  durasi_hari: number
  alasan: string | null
  status: CutiStatus
}

export type CutiJenis =
  | 'Cuti Tahunan'
  | 'Cuti Sakit'
  | 'Izin Pribadi'
  | 'Cuti Melahirkan'
  | 'Cuti Penting'

export type CutiStatus = 'Pending' | 'Disetujui' | 'Ditolak'

export interface CutiInsert {
  nama: string
  jenis: CutiJenis
  tgl_mulai: string
  tgl_selesai: string
  durasi_hari: number
  alasan: string
  status: CutiStatus
}

export const CUTI_JENIS_OPTIONS: CutiJenis[] = [
  'Cuti Tahunan',
  'Cuti Sakit',
  'Izin Pribadi',
  'Cuti Melahirkan',
  'Cuti Penting',
]

export const CUTI_STATUS_OPTIONS: CutiStatus[] = ['Pending', 'Disetujui', 'Ditolak']

export const CUTI_JENIS_BADGE: Record<CutiJenis, BadgeConfig> = {
  'Cuti Tahunan':    { className: 'badge-blue' },
  'Cuti Sakit':      { className: 'badge-red' },
  'Izin Pribadi':    { className: 'badge-yellow' },
  'Cuti Melahirkan': { className: 'badge-orange' },
  'Cuti Penting':    { className: 'badge-gray' },
}

export const CUTI_STATUS_BADGE: Record<CutiStatus, BadgeConfig> = {
  Pending:   { className: 'badge-yellow' },
  Disetujui: { className: 'badge-green' },
  Ditolak:   { className: 'badge-red' },
}

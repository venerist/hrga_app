// General Affairs domain types

import type { BaseEntity, BadgeConfig } from './common.types'

export interface Ga extends BaseEntity {
  pemohon: string
  kategori: GaKategori
  deskripsi: string
  prioritas: GaPrioritas
  tanggal: string | null
  status: GaStatus
}

export type GaKategori =
  | 'Alat Tulis Kantor'
  | 'Perawatan Aset'
  | 'Kendaraan'
  | 'IT Support'
  | 'Kebersihan'
  | 'Lainnya'

export type GaPrioritas = 'Normal' | 'Urgent' | 'Critical'
export type GaStatus = 'Open' | 'In Progress' | 'Done' | 'Cancelled'

export interface GaInsert {
  pemohon: string
  kategori: GaKategori
  deskripsi: string
  prioritas: GaPrioritas
  tanggal: string | null
  status: GaStatus
}

export const GA_KATEGORI_OPTIONS: GaKategori[] = [
  'Alat Tulis Kantor',
  'Perawatan Aset',
  'Kendaraan',
  'IT Support',
  'Kebersihan',
  'Lainnya',
]

export const GA_PRIORITAS_OPTIONS: GaPrioritas[] = ['Normal', 'Urgent', 'Critical']
export const GA_STATUS_OPTIONS: GaStatus[] = ['Open', 'In Progress', 'Done', 'Cancelled']

export const GA_PRIORITAS_BADGE: Record<GaPrioritas, BadgeConfig> = {
  Normal:   { className: 'badge-gray' },
  Urgent:   { className: 'badge-orange' },
  Critical: { className: 'badge-red' },
}

export const GA_STATUS_BADGE: Record<GaStatus, BadgeConfig> = {
  Open:          { className: 'badge-blue' },
  'In Progress': { className: 'badge-yellow' },
  Done:          { className: 'badge-green' },
  Cancelled:     { className: 'badge-gray' },
}

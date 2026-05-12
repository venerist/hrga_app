// Recruitment domain types

import type { BaseEntity, BadgeConfig } from './common.types'

export interface Rekrutmen extends BaseEntity {
  nama: string
  posisi: string
  tgl_melamar: string | null
  status: RekrutmenStatus
  catatan: string | null
}

export type RekrutmenStatus =
  | 'Screening'
  | 'Interview'
  | 'Tes Tertulis'
  | 'Offering'
  | 'Diterima'
  | 'Ditolak'

export interface RekrutmenInsert {
  nama: string
  posisi: string
  tgl_melamar: string | null
  status: RekrutmenStatus
  catatan: string
}

export const REKRUTMEN_STATUS_OPTIONS: RekrutmenStatus[] = [
  'Screening',
  'Interview',
  'Tes Tertulis',
  'Offering',
  'Diterima',
  'Ditolak',
]

export const REKRUTMEN_STATUS_BADGE: Record<RekrutmenStatus, BadgeConfig> = {
  Screening:      { className: 'badge-gray' },
  Interview:      { className: 'badge-blue' },
  'Tes Tertulis': { className: 'badge-yellow' },
  Offering:       { className: 'badge-orange' },
  Diterima:       { className: 'badge-green' },
  Ditolak:        { className: 'badge-red' },
}

/** Statuses that mean the candidate is still in pipeline */
export const REKRUTMEN_ACTIVE_STATUSES: RekrutmenStatus[] = [
  'Screening',
  'Interview',
  'Tes Tertulis',
  'Offering',
]

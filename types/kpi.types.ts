// KPI domain types

import type { BaseEntity, BadgeConfig } from './common.types'

export interface Kpi extends BaseEntity {
  nama: string
  periode: string
  target: number
  realisasi: number
  capaian: number
  predikat: KpiPredikat
  catatan: string | null
}

export type KpiPredikat = 'Excellent' | 'Good' | 'Need Improvement'

export interface KpiInsert {
  nama: string
  periode: string
  target: number
  realisasi: number
  capaian: number
  predikat: KpiPredikat
  catatan: string
}

export const KPI_PREDIKAT_BADGE: Record<KpiPredikat, BadgeConfig> = {
  'Excellent':         { className: 'badge-green',  emoji: '🟢' },
  'Good':              { className: 'badge-blue',   emoji: '🟡' },
  'Need Improvement':  { className: 'badge-red',    emoji: '🔴' },
}

/** KPI scoring thresholds */
export const KPI_THRESHOLDS = {
  EXCELLENT: 100,  // capaian >= 100%
  GOOD: 80,        // capaian >= 80%
} as const

// KPI service — business logic for KPI evaluation and scoring

import { kpiRepository } from '@/repositories/kpi.repository'
import type { Kpi, KpiInsert, KpiPredikat } from '@/types/kpi.types'
import { KPI_THRESHOLDS } from '@/types/kpi.types'

export const kpiService = {
  /**
   * Fetch all KPI records.
   */
  async getAll(): Promise<Kpi[]> {
    return kpiRepository.getAll()
  },

  /**
   * Get summary statistics for KPI module.
   */
  getStats(rows: Kpi[]) {
    const avgCapaian = rows.length
      ? rows.reduce((s, r) => s + (r.capaian || 0), 0) / rows.length
      : 0

    return {
      total: rows.length,
      avgCapaian: Math.round(avgCapaian * 10) / 10,
      excellent: rows.filter(r => r.predikat === 'Excellent').length,
      good: rows.filter(r => r.predikat === 'Good').length,
      needImprovement: rows.filter(r => r.predikat === 'Need Improvement').length,
    }
  },

  /**
   * Calculate capaian percentage from target and realisasi.
   */
  calculateCapaian(target: number, realisasi: number): number {
    return target > 0 ? Math.round(realisasi / target * 1000) / 10 : 0
  },

  /**
   * Determine predikat based on capaian percentage.
   */
  getPredikat(capaian: number): KpiPredikat {
    if (capaian >= KPI_THRESHOLDS.EXCELLENT) return 'Excellent'
    if (capaian >= KPI_THRESHOLDS.GOOD) return 'Good'
    return 'Need Improvement'
  },

  /**
   * Validate and create a new KPI record.
   * Automatically calculates capaian and predikat.
   * @throws Error if validation fails.
   */
  async create(form: {
    nama: string
    periode: string
    target: number
    realisasi: number
    catatan: string
  }): Promise<void> {
    if (!form.nama.trim()) throw new Error('Nama karyawan wajib diisi.')
    if (!form.periode.trim()) throw new Error('Periode wajib diisi.')

    const capaian = this.calculateCapaian(form.target, form.realisasi)
    const predikat = this.getPredikat(capaian)

    const record: KpiInsert = {
      nama: form.nama.trim(),
      periode: form.periode.trim(),
      target: form.target,
      realisasi: form.realisasi,
      capaian,
      predikat,
      catatan: form.catatan.trim(),
    }

    await kpiRepository.create(record)
  },

  /**
   * Delete a KPI record.
   */
  async delete(id: string): Promise<void> {
    await kpiRepository.delete(id)
  },
}

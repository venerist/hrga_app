// Recruitment service — business logic for recruitment pipeline

import { recruitmentRepository } from '@/repositories/recruitment.repository'
import type { RekrutmenInsert, RekrutmenStatus, Rekrutmen } from '@/types/recruitment.types'
import { REKRUTMEN_ACTIVE_STATUSES } from '@/types/recruitment.types'

export const recruitmentService = {
  /**
   * Fetch all recruitment records.
   */
  async getAll(): Promise<Rekrutmen[]> {
    return recruitmentRepository.getAll()
  },

  /**
   * Get summary statistics for the recruitment module.
   */
  getStats(rows: Rekrutmen[]) {
    return {
      total: rows.length,
      aktif: rows.filter(r => REKRUTMEN_ACTIVE_STATUSES.includes(r.status)).length,
      diterima: rows.filter(r => r.status === 'Diterima').length,
      ditolak: rows.filter(r => r.status === 'Ditolak').length,
    }
  },

  /**
   * Validate and create a new recruitment record.
   * @throws Error if validation fails.
   */
  async create(form: { nama: string; posisi: string; tgl_melamar: string; status: string; catatan: string }): Promise<void> {
    if (!form.nama.trim()) throw new Error('Nama kandidat wajib diisi.')
    if (!form.posisi.trim()) throw new Error('Posisi yang dilamar wajib diisi.')

    const record: RekrutmenInsert = {
      nama: form.nama.trim(),
      posisi: form.posisi.trim(),
      tgl_melamar: form.tgl_melamar || null,
      status: form.status as RekrutmenStatus,
      catatan: form.catatan.trim(),
    }

    await recruitmentRepository.create(record)
  },

  /**
   * Update the status of a candidate in the pipeline.
   */
  async updateStatus(id: string, status: RekrutmenStatus): Promise<void> {
    await recruitmentRepository.updateStatus(id, status)
  },

  /**
   * Delete a candidate record.
   */
  async delete(id: string): Promise<void> {
    await recruitmentRepository.delete(id)
  },
}

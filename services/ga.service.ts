// General Affairs service — business logic for GA ticket management

import { gaRepository } from '@/repositories/ga.repository'
import type { Ga, GaInsert, GaStatus, GaKategori, GaPrioritas } from '@/types/ga.types'

export const gaService = {
  /**
   * Fetch all GA records.
   */
  async getAll(): Promise<Ga[]> {
    return gaRepository.getAll()
  },

  /**
   * Get summary statistics for GA module.
   */
  getStats(rows: Ga[]) {
    return {
      total: rows.length,
      open: rows.filter(r => r.status === 'Open').length,
      inProgress: rows.filter(r => r.status === 'In Progress').length,
      done: rows.filter(r => r.status === 'Done').length,
      urgentCritical: rows.filter(r => ['Urgent', 'Critical'].includes(r.prioritas)).length,
    }
  },

  /**
   * Validate and create a new GA ticket.
   * @throws Error if validation fails.
   */
  async create(form: {
    pemohon: string
    kategori: string
    deskripsi: string
    prioritas: string
    tanggal: string
  }): Promise<void> {
    if (!form.pemohon.trim()) throw new Error('Nama pemohon wajib diisi.')
    if (!form.deskripsi.trim()) throw new Error('Deskripsi wajib diisi.')

    const record: GaInsert = {
      pemohon: form.pemohon.trim(),
      kategori: form.kategori as GaKategori,
      deskripsi: form.deskripsi.trim(),
      prioritas: form.prioritas as GaPrioritas,
      tanggal: form.tanggal || null,
      status: 'Open',
    }

    await gaRepository.create(record)
  },

  /**
   * Update the status of a GA ticket.
   */
  async updateStatus(id: string, status: GaStatus): Promise<void> {
    await gaRepository.updateStatus(id, status)
  },

  /**
   * Delete a GA ticket.
   */
  async delete(id: string): Promise<void> {
    await gaRepository.delete(id)
  },
}

// Leave service — business logic for leave management

import { leaveRepository } from '@/repositories/leave.repository'
import type { Cuti, CutiInsert, CutiStatus, CutiJenis } from '@/types/leave.types'

export const leaveService = {
  /**
   * Fetch all leave records.
   */
  async getAll(): Promise<Cuti[]> {
    return leaveRepository.getAll()
  },

  /**
   * Get summary statistics for leave module.
   */
  getStats(rows: Cuti[]) {
    return {
      total: rows.length,
      totalHari: rows.reduce((s, r) => s + (r.durasi_hari || 0), 0),
      pending: rows.filter(r => r.status === 'Pending').length,
      disetujui: rows.filter(r => r.status === 'Disetujui').length,
      ditolak: rows.filter(r => r.status === 'Ditolak').length,
    }
  },

  /**
   * Calculate the duration in days between two dates (inclusive).
   */
  calculateDuration(tglMulai: string, tglSelesai: string): number {
    const diff = new Date(tglSelesai).getTime() - new Date(tglMulai).getTime()
    return Math.max(1, Math.round(diff / 86400000) + 1)
  },

  /**
   * Validate and create a new leave request.
   * @throws Error if validation fails.
   */
  async create(form: {
    nama: string
    jenis: string
    tgl_mulai: string
    tgl_selesai: string
    alasan: string
  }): Promise<void> {
    if (!form.nama.trim()) throw new Error('Nama karyawan wajib diisi.')
    if (!form.tgl_mulai) throw new Error('Tanggal mulai wajib diisi.')
    if (!form.tgl_selesai) throw new Error('Tanggal selesai wajib diisi.')

    if (new Date(form.tgl_selesai) < new Date(form.tgl_mulai)) {
      throw new Error('Tanggal selesai tidak boleh sebelum tanggal mulai.')
    }

    const durasiHari = this.calculateDuration(form.tgl_mulai, form.tgl_selesai)

    const record: CutiInsert = {
      nama: form.nama.trim(),
      jenis: form.jenis as CutiJenis,
      tgl_mulai: form.tgl_mulai,
      tgl_selesai: form.tgl_selesai,
      durasi_hari: durasiHari,
      alasan: form.alasan.trim(),
      status: 'Pending',
    }

    await leaveRepository.create(record)
  },

  /**
   * Update the status of a leave request.
   */
  async updateStatus(id: string, status: CutiStatus): Promise<void> {
    await leaveRepository.updateStatus(id, status)
  },

  /**
   * Delete a leave record.
   */
  async delete(id: string): Promise<void> {
    await leaveRepository.delete(id)
  },
}

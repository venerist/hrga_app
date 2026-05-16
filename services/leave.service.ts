// Leave service — business logic for leave management

import { attendanceRepository } from '@/repositories/attendance.repository'
import { leaveRepository } from '@/repositories/leave.repository'
import type { AbsensiStatus } from '@/types/attendance.types'
import type { Cuti, CutiInsert, CutiStatus } from '@/types/leave.types'

export const leaveService = {
  async getAll(): Promise<Cuti[]> {
    return leaveRepository.getAll()
  },

  getStats(rows: Cuti[]) {
    return {
      total: rows.length,
      totalHari: rows.reduce((s, r) => s + (r.durasi_hari || 0), 0),
      pending: rows.filter(r => r.status === 'Pending').length,
      approved: rows.filter(r => r.status === 'Approved').length,
      rejected: rows.filter(r => r.status === 'Rejected').length,
    }
  },

  calculateDuration(startDate: string, endDate: string): number {
    const diff = new Date(endDate).getTime() - new Date(startDate).getTime()
    return Math.max(1, Math.round(diff / 86400000) + 1)
  },

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

    const durasi = this.calculateDuration(form.tgl_mulai, form.tgl_selesai)

    const record: CutiInsert = {
      nama: form.nama.trim(),
      jenis: form.jenis,
      tgl_mulai: form.tgl_mulai,
      tgl_selesai: form.tgl_selesai,
      durasi_hari: durasi,
      alasan: form.alasan.trim(),
      status: 'Pending',
    }

    await leaveRepository.create(record)
  },

  async updateStatus(id: string, status: CutiStatus): Promise<void> {
    await leaveRepository.updateStatus(id, status)
  },

  async delete(id: string): Promise<void> {
    await leaveRepository.delete(id)
  },
}

// Attendance service — business logic for fingerprint processing and attendance summaries
// Extracts processing logic from payroll/page.tsx and lib/fingerprint.ts

import { attendanceRepository } from '@/repositories/attendance.repository'
import type {
  Absensi,
  AbsensiStatus,
  RekapKaryawan,
  AttendanceStats,
  RawFingerprintRecord,
  AttendanceSummary,
} from '@/types/attendance.types'
import { ATTENDANCE_CONFIG } from '@/lib/attendance/attendance-utils'

function getAttendanceConstants() {
  const [startHour, startMin] = (ATTENDANCE_CONFIG.WORK_START || '08:00').split(':').map(Number)
  return {
    JAM_MASUK_STD: startHour * 60 + startMin,
    TOLERANSI: 5
  }
}

function formatTime(d: Date): string {
  return d.toTimeString().slice(0, 5)
}

function getPeriode(tanggal: string): string {
  return tanggal.slice(0, 7) // "2026-03"
}

function mapToSummary(record: Omit<Absensi, 'id' | 'created_at'>): Omit<AttendanceSummary, 'id' | 'updated_at'> {
  return {
    employee_nik: record.no_id || record.nama,
    attendance_date: record.tanggal,
    status: record.status,
    late_minutes: record.menit_terlambat,
    overtime_minutes: 0,
    work_hours: record.durasi_jam ?? 0,
    check_in: record.jam_masuk,
    check_out: record.jam_keluar,
  }
}

export const attendanceService = {
  /**
   * Process raw fingerprint Excel data into structured attendance records.
   * Groups entries by (Nama, Tanggal), determines shift, calculates lateness.
   */
  processFingerprint(rawData: RawFingerprintRecord[]): Omit<Absensi, 'id' | 'created_at'>[] {
    const grouped: Record<string, {
      departemen: string
      nama: string
      no_id: string
      times: Date[]
    }> = {}

    for (const row of rawData) {
      if (!row['Nama'] || !row['Tgl/Waktu']) continue
      const dt = new Date(row['Tgl/Waktu'])
      if (isNaN(dt.getTime())) continue

      const tanggal = dt.toISOString().slice(0, 10)
      const key = `${row['Nama']}__${tanggal}`

      if (!grouped[key]) {
        grouped[key] = {
          departemen: row['Departemen'] || '-',
          nama: row['Nama'],
          no_id: row['No.ID'] || row['Nama'],
          times: [],
        }
      }
      grouped[key].times.push(dt)
    }

    const { JAM_MASUK_STD, TOLERANSI } = getAttendanceConstants()
    const results: Omit<Absensi, 'id' | 'created_at'>[] = []

    for (const [key, val] of Object.entries(grouped)) {
      const tanggal = key.split('__')[1]
      const sorted = val.times.sort((a, b) => a.getTime() - b.getTime())
      const jamMasuk = sorted[0]
      const jamKeluar = sorted[sorted.length - 1]
      const jmlTap = sorted.length

      const jamMasukStr = formatTime(jamMasuk)
      const jamKeluarStr = formatTime(jamKeluar)

      const durasiJam = jmlTap >= 2
        ? (jamKeluar.getTime() - jamMasuk.getTime()) / 3600000
        : null

      const shift = jamMasuk.getHours() < 12 ? 'Pagi' : 'Siang/Malam'

      let menitTerlambat = 0
      if (shift === 'Pagi') {
        const menit = jamMasuk.getHours() * 60 + jamMasuk.getMinutes()
        menitTerlambat = Math.max(0, menit - JAM_MASUK_STD)
      }

      let status: AbsensiStatus
      if (jmlTap === 1) {
        status = jamMasuk.getHours() < 11 ? 'Tap Masuk' : 'Tap Keluar'
      } else if (shift === 'Siang/Malam') {
        status = 'Shift'
      } else if (menitTerlambat > TOLERANSI) {
        status = 'Terlambat'
      } else {
        status = 'Tepat Waktu'
      }

      results.push({
        departemen: val.departemen,
        nama: val.nama,
        no_id: val.no_id,
        tanggal,
        jam_masuk: jamMasuk.toISOString(),
        jam_keluar: jamKeluar.toISOString(),
        jam_masuk_str: jamMasukStr,
        jam_keluar_str: jamKeluarStr,
        durasi_jam: durasiJam !== null ? Math.round(durasiJam * 100) / 100 : null,
        shift,
        menit_terlambat: menitTerlambat,
        jml_tap: jmlTap,
        status,
        periode: getPeriode(tanggal),
      })
    }

    return results
  },

  /**
   * Calculate per-employee attendance summary (rekap).
   */
  calculateRekap(data: Omit<Absensi, 'id' | 'created_at'>[]): RekapKaryawan[] {
    const totalHari = new Set(data.map(d => d.tanggal)).size
    const grouped: Record<string, Omit<Absensi, 'id' | 'created_at'>[]> = {}

    for (const r of data) {
      if (!grouped[r.nama]) grouped[r.nama] = []
      grouped[r.nama].push(r)
    }

    return Object.entries(grouped)
      .map(([nama, rows]) => {
        const hariHadir = rows.length
        const terlambat = rows.filter(r => r.status === 'Terlambat').length
        const tap1x = rows.filter(r => r.status === 'Tap Masuk' || r.status === 'Tap Keluar').length
        const totalMntTelat = rows.reduce((s, r) => s + r.menit_terlambat, 0)
        const durasis = rows.filter(r => r.durasi_jam !== null).map(r => r.durasi_jam as number)
        const avgJam = durasis.length ? durasis.reduce((a, b) => a + b, 0) / durasis.length : 0

        return {
          nama,
          departemen: rows[0].departemen,
          hari_hadir: hariHadir,
          tidak_hadir: totalHari - hariHadir,
          pct_kehadiran: Math.round(hariHadir / totalHari * 1000) / 10,
          terlambat,
          tap_1x: tap1x,
          total_mnt_telat: totalMntTelat,
          avg_jam: Math.round(avgJam * 100) / 100,
        }
      })
      .sort((a, b) => b.total_mnt_telat - a.total_mnt_telat)
  },

  /**
   * Calculate tap-1x statistics for a set of processed records.
   */
  calculateTap1xStats(data: Omit<Absensi, 'id' | 'created_at'>[]): { count: number; pct: number } {
    const count = data.filter(r => r.status === 'Tap Masuk' || r.status === 'Tap Keluar').length
    const pct = data.length ? Math.round(count / data.length * 100) : 0
    return { count, pct }
  },

  /**
   * Save processed attendance data to the database.
   * Writes both legacy absensi and new attendance_summary records.
   */
  async saveToDatabase(data: Omit<Absensi, 'id' | 'created_at'>[], periode: string): Promise<void> {
    const summaryRecords = data.map(mapToSummary)
    await attendanceRepository.bulkUpsertSummary(summaryRecords)
    await attendanceRepository.bulkUpsert(data, periode)
  },
}

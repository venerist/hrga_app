// Dashboard service — aggregation logic for the main dashboard
// Extracts the heavy data-processing from dashboard/page.tsx

import { attendanceRepository } from '@/repositories/attendance.repository'
import { recruitmentRepository } from '@/repositories/recruitment.repository'
import { leaveRepository } from '@/repositories/leave.repository'
import { kpiRepository } from '@/repositories/kpi.repository'
import { gaRepository } from '@/repositories/ga.repository'

export interface DashboardStats {
  rekrutmen: number
  cuti: number
  kpi: number
  ga: number
  totalKaryawan: number
  hariKerja: number
  terlambat: number
  tap1x: number
  totalMntTelat: number
  periodeLabel: string
}

export interface TopTerlambat {
  nama: string
  frekuensi: number
  total: number
}

export interface TopAbsen {
  nama: string
  hadir: number
  absen: number
  pct: number
}

export const dashboardService = {
  /**
   * Load all dashboard data in parallel.
   * Returns stats, top late employees, and top absent employees.
   */
  async loadDashboard(): Promise<{
    stats: DashboardStats
    topTelat: TopTerlambat[]
    topAbsen: TopAbsen[]
  }> {
    // Fetch all module counts and attendance data in parallel
    const [rekrutmen, cuti, kpi, ga, absensi] = await Promise.all([
      recruitmentRepository.getCount(),
      leaveRepository.getCount(),
      kpiRepository.getCount(),
      gaRepository.getCount(),
      attendanceRepository.getDashboardData(),
    ])

    if (!absensi || absensi.length === 0) {
      return {
        stats: {
          rekrutmen, cuti, kpi, ga,
          totalKaryawan: 0, hariKerja: 0, terlambat: 0, tap1x: 0, totalMntTelat: 0,
          periodeLabel: '-',
        },
        topTelat: [],
        topAbsen: [],
      }
    }

    // Calculate attendance statistics
    const namas = new Set(absensi.map(r => r.nama))
    const tanggals = new Set(absensi.map(r => r.tanggal))
    const terlambatRows = absensi.filter(r => r.status === 'Terlambat')
    const tap1xArr = absensi.filter(r => r.status === 'Tap Masuk' || r.status === 'Tap Keluar')
    const totalMntTelat = absensi.reduce((s, r) => s + (r.menit_terlambat || 0), 0)

    // Top terlambat
    const telatMap: Record<string, { frekuensi: number; total: number }> = {}
    for (const r of terlambatRows) {
      if (!telatMap[r.nama]) telatMap[r.nama] = { frekuensi: 0, total: 0 }
      telatMap[r.nama].frekuensi++
      telatMap[r.nama].total += r.menit_terlambat || 0
    }
    const topTelat = Object.entries(telatMap)
      .map(([nama, v]) => ({ nama, ...v }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 7)

    // Top absen (most absences)
    const hadirMap: Record<string, number> = {}
    for (const r of absensi) { hadirMap[r.nama] = (hadirMap[r.nama] || 0) + 1 }
    const totalHari = tanggals.size
    const topAbsen = Object.entries(hadirMap)
      .map(([nama, hadir]) => ({
        nama,
        hadir,
        absen: totalHari - hadir,
        pct: Math.round(hadir / totalHari * 100),
      }))
      .sort((a, b) => b.absen - a.absen)
      .slice(0, 7)

    // Periode label
    const latestTgl = Array.from(tanggals).sort().reverse()[0]
    const d = new Date(latestTgl)
    const periodeLabel = d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })

    return {
      stats: {
        rekrutmen, cuti, kpi, ga,
        totalKaryawan: namas.size,
        hariKerja: tanggals.size,
        terlambat: terlambatRows.length,
        tap1x: tap1xArr.length,
        totalMntTelat,
        periodeLabel,
      },
      topTelat,
      topAbsen,
    }
  },
}

'use client'
import { useEffect, useState } from 'react'
import { dashboardService, type DashboardStats, type TopTerlambat, type TopAbsen } from '@/services/dashboard.service'
import { MetricCard, PageHeader, LoadingSpinner } from '@/components/ui'
import { Upload } from 'lucide-react'

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [topTelat, setTopTelat] = useState<TopTerlambat[]>([])
  const [topAbsen, setTopAbsen] = useState<TopAbsen[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const result = await dashboardService.loadDashboard()
        setStats(result.stats)
        setTopTelat(result.topTelat)
        setTopAbsen(result.topAbsen)
      } catch (e) { console.error('Dashboard load error:', e) }
      finally { setLoading(false) }
    }
    load()
  }, [])

  if (loading) return <LoadingSpinner fullPage text="Memuat dashboard..." />

  return (
    <div className="space-y-6">
      <PageHeader icon="🏠" title="Dashboard" subtitle={`Ringkasan HRGA — ${stats?.periodeLabel}`} />

      {/* Module Counts */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Rekrutmen" value={stats?.rekrutmen ?? 0} icon="🎯" />
        <MetricCard label="Pengajuan Cuti" value={stats?.cuti ?? 0} icon="📅" />
        <MetricCard label="Data KPI" value={stats?.kpi ?? 0} icon="⭐" />
        <MetricCard label="Tiket GA" value={stats?.ga ?? 0} icon="🔧" />
      </div>

      {stats?.totalKaryawan ? (
        <>
          <div className="border-t border-border" />
          <h2 className="text-sm font-bold text-dark">📊 Ringkasan Absensi — {stats.periodeLabel}</h2>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <MetricCard label="Total Karyawan" value={stats.totalKaryawan} icon="👥" />
            <MetricCard label="Hari Kerja" value={stats.hariKerja} icon="📆" />
            <MetricCard label="Total Terlambat" value={stats.terlambat} icon="⚠️" />
            <MetricCard label="Total Mnt Telat" value={stats.totalMntTelat} icon="⏱️" />
            <MetricCard label="Data Tap 1x" value={stats.tap1x} icon="🟡" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Top Late */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="px-5 py-3.5 border-b border-border bg-surface/50">
                <h3 className="text-xs font-bold text-dark">🔴 Top Terlambat</h3>
              </div>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border/60">
                  <th className="px-5 py-2.5 text-left text-[0.68rem] font-semibold text-muted uppercase tracking-wider">Nama</th>
                  <th className="px-5 py-2.5 text-left text-[0.68rem] font-semibold text-muted uppercase tracking-wider">Frekuensi</th>
                  <th className="px-5 py-2.5 text-left text-[0.68rem] font-semibold text-muted uppercase tracking-wider">Total Mnt</th>
                </tr></thead>
                <tbody className="divide-y divide-border/40">
                  {topTelat.length === 0
                    ? <tr><td colSpan={3} className="px-5 py-6 text-center text-muted text-sm">Tidak ada ✅</td></tr>
                    : topTelat.map((r, i) => (
                      <tr key={i} className="hover:bg-surface/60 transition-colors">
                        <td className="px-5 py-2.5 font-semibold text-dark">{r.nama}</td>
                        <td className="px-5 py-2.5"><span className="inline-flex px-2 py-0.5 rounded-full text-[0.68rem] font-semibold bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-600/10">{r.frekuensi}x</span></td>
                        <td className="px-5 py-2.5 font-mono text-xs font-bold text-err">{r.total} mnt</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Top Absent */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="px-5 py-3.5 border-b border-border bg-surface/50">
                <h3 className="text-xs font-bold text-dark">🔵 Top Ketidakhadiran</h3>
              </div>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border/60">
                  <th className="px-5 py-2.5 text-left text-[0.68rem] font-semibold text-muted uppercase tracking-wider">Nama</th>
                  <th className="px-5 py-2.5 text-left text-[0.68rem] font-semibold text-muted uppercase tracking-wider">Hadir</th>
                  <th className="px-5 py-2.5 text-left text-[0.68rem] font-semibold text-muted uppercase tracking-wider">Absen</th>
                  <th className="px-5 py-2.5 text-left text-[0.68rem] font-semibold text-muted uppercase tracking-wider">%</th>
                </tr></thead>
                <tbody className="divide-y divide-border/40">
                  {topAbsen.map((r, i) => (
                    <tr key={i} className="hover:bg-surface/60 transition-colors">
                      <td className="px-5 py-2.5 font-semibold text-dark">{r.nama}</td>
                      <td className="px-5 py-2.5 font-mono text-xs">{r.hadir}</td>
                      <td className="px-5 py-2.5"><span className="inline-flex px-2 py-0.5 rounded-full text-[0.68rem] font-semibold bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10">{r.absen}</span></td>
                      <td className="px-5 py-2.5 font-mono text-xs">{r.pct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-blue-50 text-blue-800 text-sm border border-blue-100">
          <Upload size={18} /> Upload data fingerprint di menu <strong>Attendance Management</strong> untuk melihat ringkasan.
        </div>
      )}
    </div>
  )
}

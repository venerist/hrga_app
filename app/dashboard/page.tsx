'use client'
import { useEffect, useState } from 'react'
import { dashboardService, type DashboardStats, type TopTerlambat, type TopAbsen } from '@/services/dashboard.service'
import { MetricCard, PageHeader, LoadingSpinner } from '@/components/ui'

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
      } catch (e) {
        console.error('Dashboard load error:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <LoadingSpinner fullPage text="Memuat data..." />

  return (
    <div>
      <PageHeader icon="🏠" title="Dashboard" subtitle={`Ringkasan HRGA — ${stats?.periodeLabel}`} />

      {/* Module counts */}
      <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <MetricCard label="Rekrutmen" value={stats?.rekrutmen ?? 0} icon="🎯" />
        <MetricCard label="Pengajuan Cuti" value={stats?.cuti ?? 0} icon="📅" />
        <MetricCard label="Data KPI" value={stats?.kpi ?? 0} icon="⭐" />
        <MetricCard label="Tiket GA" value={stats?.ga ?? 0} icon="🔧" />
      </div>

      {stats?.totalKaryawan ? (
        <>
          <hr className="divider" />
          <div className="section-title">📊 Ringkasan Absensi {stats.periodeLabel}</div>

          <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
            <MetricCard label="Total Karyawan" value={stats.totalKaryawan} icon="👥" />
            <MetricCard label="Hari Kerja" value={stats.hariKerja} icon="📆" />
            <MetricCard label="Total Terlambat" value={stats.terlambat} icon="⚠️" />
            <MetricCard label="Total Mnt Telat" value={stats.totalMntTelat} icon="⏱️" />
            <MetricCard label="Data Tap 1x" value={stats.tap1x} icon="🟡" />
          </div>

          <div className="grid-2" style={{ marginTop: 20 }}>
            <div>
              <div className="section-title">🔴 Top Terlambat</div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Nama</th><th>Frekuensi</th><th>Total Mnt</th></tr></thead>
                  <tbody>
                    {topTelat.length === 0
                      ? <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--muted)' }}>Tidak ada ✅</td></tr>
                      : topTelat.map((r, i) => (
                        <tr key={i}>
                          <td style={{ fontWeight: 600 }}>{r.nama}</td>
                          <td><span className="badge badge-orange">{r.frekuensi}x</span></td>
                          <td className="mono" style={{ color: 'var(--err)', fontWeight: 700 }}>{r.total} mnt</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <div className="section-title">🔵 Top Ketidakhadiran</div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Nama</th><th>Hadir</th><th>Absen</th><th>%</th></tr></thead>
                  <tbody>
                    {topAbsen.map((r, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600 }}>{r.nama}</td>
                        <td className="mono">{r.hadir}</td>
                        <td><span className="badge badge-red">{r.absen}</span></td>
                        <td className="mono">{r.pct}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="alert alert-info">
          💡 Upload data fingerprint di menu <strong>Payroll & Absensi</strong> untuk melihat ringkasan.
        </div>
      )}
    </div>
  )
}

'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Stats {
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

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [topTelat, setTopTelat] = useState<any[]>([])
  const [topAbsen, setTopAbsen] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [
        { count: rekrutmen },
        { count: cuti },
        { count: kpi },
        { count: ga },
        { data: absensi },
      ] = await Promise.all([
        supabase.from('rekrutmen').select('*', { count: 'exact', head: true }),
        supabase.from('cuti').select('*', { count: 'exact', head: true }),
        supabase.from('kpi').select('*', { count: 'exact', head: true }),
        supabase.from('ga').select('*', { count: 'exact', head: true }),
        supabase.from('absensi').select('nama,tanggal,status,menit_terlambat,departemen').order('tanggal', { ascending: false }),
      ])

      if (absensi && absensi.length > 0) {
        const namas = new Set(absensi.map((r: any) => r.nama))
        const tanggals = new Set(absensi.map((r: any) => r.tanggal))
        const terlambat = absensi.filter((r: any) => r.status === 'Terlambat')
        const tap1xArr = absensi.filter((r: any) => r.status === 'Tap Masuk' || r.status === 'Tap Keluar')
        const totalMntTelat = absensi.reduce((s: number, r: any) => s + (r.menit_terlambat || 0), 0)

        // top terlambat
        const telatMap: Record<string, { frekuensi: number; total: number }> = {}
        for (const r of terlambat) {
          if (!telatMap[r.nama]) telatMap[r.nama] = { frekuensi: 0, total: 0 }
          telatMap[r.nama].frekuensi++
          telatMap[r.nama].total += r.menit_terlambat || 0
        }
        const topT = Object.entries(telatMap)
          .map(([nama, v]) => ({ nama, ...v }))
          .sort((a, b) => b.total - a.total).slice(0, 7)
        setTopTelat(topT)

        // top absen
        const hadirMap: Record<string, number> = {}
        for (const r of absensi) { hadirMap[r.nama] = (hadirMap[r.nama] || 0) + 1 }
        const totalHari = tanggals.size
        const topA = Object.entries(hadirMap)
          .map(([nama, hadir]) => ({ nama, hadir, absen: totalHari - hadir, pct: Math.round(hadir / totalHari * 100) }))
          .sort((a, b) => b.absen - a.absen).slice(0, 7)
        setTopAbsen(topA)

        // periode label
        const latestTgl = Array.from(tanggals).sort().reverse()[0] as string
        const d = new Date(latestTgl)
        const periodeLabel = d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })

        setStats({
          rekrutmen: rekrutmen || 0,
          cuti: cuti || 0,
          kpi: kpi || 0,
          ga: ga || 0,
          totalKaryawan: namas.size,
          hariKerja: tanggals.size,
          terlambat: terlambat.length,
          tap1x: tap1xArr.length,
          totalMntTelat,
          periodeLabel,
        })
      } else {
        setStats({
          rekrutmen: rekrutmen || 0, cuti: cuti || 0, kpi: kpi || 0, ga: ga || 0,
          totalKaryawan: 0, hariKerja: 0, terlambat: 0, tap1x: 0, totalMntTelat: 0,
          periodeLabel: '-',
        })
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 12 }}>
      <span className="spinner" /> <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Memuat data...</span>
    </div>
  )

  return (
    <div>
      <div className="page-header">
        <h1>🏠 Dashboard</h1>
        <p>Ringkasan HRGA — {stats?.periodeLabel}</p>
      </div>

      {/* Modul counts */}
      <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {[
          { label: 'Rekrutmen', value: stats?.rekrutmen, icon: '🎯' },
          { label: 'Pengajuan Cuti', value: stats?.cuti, icon: '📅' },
          { label: 'Data KPI', value: stats?.kpi, icon: '⭐' },
          { label: 'Tiket GA', value: stats?.ga, icon: '🔧' },
        ].map(m => (
          <div key={m.label} className="metric-card">
            <div className="metric-label">{m.icon} {m.label}</div>
            <div className="metric-value">{m.value}</div>
          </div>
        ))}
      </div>

      {stats?.totalKaryawan ? (
        <>
          <hr className="divider" />
          <div className="section-title">📊 Ringkasan Absensi {stats.periodeLabel}</div>

          <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
            {[
              { label: 'Total Karyawan', value: stats.totalKaryawan, icon: '👥' },
              { label: 'Hari Kerja', value: stats.hariKerja, icon: '📆' },
              { label: 'Total Terlambat', value: stats.terlambat, icon: '⚠️' },
              { label: 'Total Mnt Telat', value: stats.totalMntTelat, icon: '⏱️' },
              { label: 'Data Tap 1x', value: stats.tap1x, icon: '🟡' },
            ].map(m => (
              <div key={m.label} className="metric-card">
                <div className="metric-label">{m.icon} {m.label}</div>
                <div className="metric-value">{m.value}</div>
              </div>
            ))}
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

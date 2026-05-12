'use client'
import { useState, useEffect } from 'react'
import { kpiService } from '@/services/kpi.service'
import { MetricCard, PageHeader, StatusBadge, EmptyState, LoadingSpinner } from '@/components/ui'
import type { Kpi } from '@/types/kpi.types'
import { KPI_PREDIKAT_BADGE } from '@/types/kpi.types'

export default function KpiPage() {
  const [rows, setRows] = useState<Kpi[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nama: '', periode: '', target: 100, realisasi: 100, catatan: '' })

  async function load() {
    setLoading(true)
    try { setRows(await kpiService.getAll()) } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function save() {
    try {
      setSaving(true)
      await kpiService.create(form)
      setShowForm(false)
      setForm({ nama: '', periode: '', target: 100, realisasi: 100, catatan: '' })
      load()
    } catch (e: any) { alert(e.message) }
    finally { setSaving(false) }
  }

  async function hapus(id: string) {
    if (!confirm('Hapus data KPI ini?')) return
    await kpiService.delete(id)
    load()
  }

  const stats = kpiService.getStats(rows)
  const previewCapaian = kpiService.calculateCapaian(form.target, form.realisasi)
  const previewPredikat = kpiService.getPredikat(previewCapaian)

  return (
    <div>
      <PageHeader icon="⭐" title="Penilaian KPI" subtitle="Evaluasi kinerja karyawan berdasarkan target & realisasi" />
      <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 16 }}>
        <MetricCard label="Total Penilaian" value={stats.total} icon="📋" />
        <MetricCard label="Avg Capaian" value={`${stats.avgCapaian}%`} icon="📈" />
        <MetricCard label="Excellent" value={stats.excellent} icon="🟢" />
        <MetricCard label="Need Improvement" value={stats.needImprovement} icon="🔴" />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Tutup' : '➕ Input KPI'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="section-title">➕ Input Penilaian KPI</div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Nama Karyawan *</label>
              <input className="form-input" value={form.nama} onChange={e => setForm({ ...form, nama: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Periode *</label>
              <input className="form-input" placeholder="Maret 2026" value={form.periode} onChange={e => setForm({ ...form, periode: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Target (%)</label>
              <input className="form-input" type="number" min={0} max={100} value={form.target} onChange={e => setForm({ ...form, target: +e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Realisasi (%)</label>
              <input className="form-input" type="number" min={0} max={200} value={form.realisasi} onChange={e => setForm({ ...form, realisasi: +e.target.value })} />
            </div>
          </div>
          <div style={{ background: '#f5f4f1', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', marginBottom: 12, fontSize: '0.82rem' }}>
            Preview: Capaian = <strong>{Math.round(previewCapaian)}%</strong> → {previewPredikat === 'Excellent' ? '🟢 Excellent' : previewPredikat === 'Good' ? '🟡 Good' : '🔴 Need Improvement'}
          </div>
          <div className="form-group">
            <label className="form-label">Catatan</label>
            <textarea className="form-textarea" value={form.catatan} onChange={e => setForm({ ...form, catatan: e.target.value })} />
          </div>
          <button className="btn btn-primary" onClick={save} disabled={saving}>
            {saving ? <span className="spinner" /> : '💾 Simpan KPI'}
          </button>
        </div>
      )}

      {loading ? <LoadingSpinner /> : rows.length === 0 ? <EmptyState icon="⭐" message="Belum ada data KPI." /> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Nama</th><th>Periode</th><th>Target</th><th>Realisasi</th><th>Capaian</th><th>Predikat</th><th>Catatan</th><th></th></tr></thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 700 }}>{r.nama}</td>
                  <td><span className="badge badge-gray">{r.periode}</span></td>
                  <td className="mono">{r.target}%</td>
                  <td className="mono">{r.realisasi}%</td>
                  <td className="mono" style={{ fontWeight: 700 }}>{r.capaian}%</td>
                  <td><StatusBadge label={r.predikat} config={KPI_PREDIKAT_BADGE[r.predikat]} /></td>
                  <td style={{ color: 'var(--muted)' }}>{r.catatan || '-'}</td>
                  <td><button className="btn btn-sm" style={{ background: '#fee2e2', color: '#b91c1c', border: 'none' }} onClick={() => hapus(r.id)}>🗑️</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

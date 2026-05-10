'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

function predikatBadge(p: string) {
  if (p.includes('Excellent')) return <span className="badge badge-green">🟢 Excellent</span>
  if (p.includes('Good'))      return <span className="badge badge-blue">🟡 Good</span>
  return <span className="badge badge-red">🔴 Need Improvement</span>
}

export default function KpiPage() {
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nama: '', periode: '', target: 100, realisasi: 100, catatan: '' })

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('kpi').select('*').order('created_at', { ascending: false })
    setRows(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function save() {
    if (!form.nama || !form.periode) return alert('Nama dan Periode wajib diisi.')
    const capaian = form.target > 0 ? Math.round(form.realisasi / form.target * 1000) / 10 : 0
    const predikat = capaian >= 100 ? 'Excellent' : capaian >= 80 ? 'Good' : 'Need Improvement'
    setSaving(true)
    await supabase.from('kpi').insert({ ...form, capaian, predikat })
    setSaving(false)
    setShowForm(false)
    setForm({ nama: '', periode: '', target: 100, realisasi: 100, catatan: '' })
    load()
  }

  async function hapus(id: string) {
    if (!confirm('Hapus data KPI ini?')) return
    await supabase.from('kpi').delete().eq('id', id)
    load()
  }

  const avgCapaian = rows.length ? rows.reduce((s, r) => s + (r.capaian || 0), 0) / rows.length : 0

  return (
    <div>
      <div className="page-header">
        <h1>⭐ Penilaian KPI</h1>
        <p>Evaluasi kinerja karyawan berdasarkan target & realisasi</p>
      </div>

      <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 16 }}>
        <div className="metric-card"><div className="metric-label">📋 Total Penilaian</div><div className="metric-value">{rows.length}</div></div>
        <div className="metric-card"><div className="metric-label">📈 Avg Capaian</div><div className="metric-value">{avgCapaian.toFixed(1)}%</div></div>
        <div className="metric-card"><div className="metric-label">🟢 Excellent</div><div className="metric-value">{rows.filter(r => r.predikat === 'Excellent').length}</div></div>
        <div className="metric-card"><div className="metric-label">🔴 Need Improvement</div><div className="metric-value">{rows.filter(r => r.predikat === 'Need Improvement').length}</div></div>
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
            Preview: Capaian = <strong>{form.target > 0 ? Math.round(form.realisasi / form.target * 100) : 0}%</strong> →{' '}
            {form.target > 0 && form.realisasi / form.target >= 1 ? '🟢 Excellent' :
             form.target > 0 && form.realisasi / form.target >= 0.8 ? '🟡 Good' : '🔴 Need Improvement'}
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

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}><span className="spinner" /></div>
      ) : rows.length === 0 ? (
        <div className="empty-state"><div className="icon">⭐</div><p>Belum ada data KPI.</p></div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Nama</th><th>Periode</th><th>Target</th><th>Realisasi</th><th>Capaian</th><th>Predikat</th><th>Catatan</th><th></th></tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 700 }}>{r.nama}</td>
                  <td><span className="badge badge-gray">{r.periode}</span></td>
                  <td className="mono">{r.target}%</td>
                  <td className="mono">{r.realisasi}%</td>
                  <td className="mono" style={{ fontWeight: 700 }}>{r.capaian}%</td>
                  <td>{predikatBadge(r.predikat)}</td>
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

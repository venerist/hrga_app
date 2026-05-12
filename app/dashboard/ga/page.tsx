'use client'
import { useState, useEffect } from 'react'
import { gaService } from '@/services/ga.service'
import { MetricCard, PageHeader, StatusBadge, EmptyState, LoadingSpinner } from '@/components/ui'
import type { Ga, GaStatus } from '@/types/ga.types'
import { GA_KATEGORI_OPTIONS, GA_PRIORITAS_OPTIONS, GA_STATUS_OPTIONS, GA_PRIORITAS_BADGE, GA_STATUS_BADGE } from '@/types/ga.types'

export default function GaPage() {
  const [rows, setRows] = useState<Ga[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ pemohon: '', kategori: 'Alat Tulis Kantor', deskripsi: '', prioritas: 'Normal', tanggal: '' })

  async function load() {
    setLoading(true)
    try { setRows(await gaService.getAll()) } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function save() {
    try {
      setSaving(true)
      await gaService.create(form)
      setShowForm(false)
      setForm({ pemohon: '', kategori: 'Alat Tulis Kantor', deskripsi: '', prioritas: 'Normal', tanggal: '' })
      load()
    } catch (e: any) { alert(e.message) }
    finally { setSaving(false) }
  }

  async function updateStatus(id: string, status: string) {
    await gaService.updateStatus(id, status as GaStatus)
    load()
  }

  async function hapus(id: string) {
    if (!confirm('Hapus tiket ini?')) return
    await gaService.delete(id)
    load()
  }

  const stats = gaService.getStats(rows)

  return (
    <div>
      <PageHeader icon="🔧" title="General Affairs" subtitle="Log permintaan & pemeliharaan aset kantor" />
      <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 16 }}>
        <MetricCard label="Total Tiket" value={stats.total} icon="🎫" />
        <MetricCard label="Open" value={stats.open} icon="🔄" />
        <MetricCard label="Urgent/Critical" value={stats.urgentCritical} icon="🚨" />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Tutup' : '➕ Buat Tiket GA'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="section-title">➕ Tiket Baru</div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Nama Pemohon *</label>
              <input className="form-input" value={form.pemohon} onChange={e => setForm({ ...form, pemohon: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Kategori</label>
              <select className="form-select" value={form.kategori} onChange={e => setForm({ ...form, kategori: e.target.value })}>
                {GA_KATEGORI_OPTIONS.map(k => <option key={k}>{k}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Prioritas</label>
              <select className="form-select" value={form.prioritas} onChange={e => setForm({ ...form, prioritas: e.target.value })}>
                {GA_PRIORITAS_OPTIONS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Tanggal</label>
              <input className="form-input" type="date" value={form.tanggal} onChange={e => setForm({ ...form, tanggal: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Deskripsi *</label>
            <textarea className="form-textarea" value={form.deskripsi} onChange={e => setForm({ ...form, deskripsi: e.target.value })} />
          </div>
          <button className="btn btn-primary" onClick={save} disabled={saving}>
            {saving ? <span className="spinner" /> : '💾 Buat Tiket'}
          </button>
        </div>
      )}

      {loading ? <LoadingSpinner /> : rows.length === 0 ? <EmptyState icon="🔧" message="Belum ada tiket GA." /> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Pemohon</th><th>Kategori</th><th>Deskripsi</th><th>Prioritas</th><th>Tanggal</th><th>Status</th><th>Aksi</th></tr></thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 700 }}>{r.pemohon}</td>
                  <td><span className="badge badge-gray">{r.kategori}</span></td>
                  <td style={{ maxWidth: 240, color: 'var(--muted)' }}>{r.deskripsi}</td>
                  <td><StatusBadge label={r.prioritas} config={GA_PRIORITAS_BADGE[r.prioritas]} /></td>
                  <td className="mono">{r.tanggal || '-'}</td>
                  <td><StatusBadge label={r.status} config={GA_STATUS_BADGE[r.status]} /></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <select className="form-select" style={{ padding: '4px 8px', fontSize: '0.75rem', width: 'auto' }} value={r.status} onChange={e => updateStatus(r.id, e.target.value)}>
                        {GA_STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                      </select>
                      <button className="btn btn-sm" style={{ background: '#fee2e2', color: '#b91c1c', border: 'none' }} onClick={() => hapus(r.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

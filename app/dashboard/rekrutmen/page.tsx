'use client'
import { useState, useEffect } from 'react'
import { recruitmentService } from '@/services/recruitment.service'
import { MetricCard, PageHeader, StatusBadge, EmptyState, LoadingSpinner } from '@/components/ui'
import type { Rekrutmen, RekrutmenStatus } from '@/types/recruitment.types'
import { REKRUTMEN_STATUS_OPTIONS, REKRUTMEN_STATUS_BADGE } from '@/types/recruitment.types'

export default function RekrutmenPage() {
  const [rows, setRows] = useState<Rekrutmen[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nama: '', posisi: '', tgl_melamar: '', status: 'Screening', catatan: '' })

  async function load() {
    setLoading(true)
    try {
      const data = await recruitmentService.getAll()
      setRows(data)
    } catch (e) {
      console.error('Load error:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function save() {
    try {
      setSaving(true)
      await recruitmentService.create(form)
      setShowForm(false)
      setForm({ nama: '', posisi: '', tgl_melamar: '', status: 'Screening', catatan: '' })
      load()
    } catch (e: any) {
      alert(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function updateStatus(id: string, status: string) {
    await recruitmentService.updateStatus(id, status as RekrutmenStatus)
    load()
  }

  async function hapus(id: string) {
    if (!confirm('Hapus kandidat ini?')) return
    await recruitmentService.delete(id)
    load()
  }

  const stats = recruitmentService.getStats(rows)

  return (
    <div>
      <PageHeader icon="🎯" title="Rekrutmen" subtitle="Pipeline kandidat & status seleksi" />

      <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 16 }}>
        <MetricCard label="Total Kandidat" value={stats.total} icon="👥" />
        <MetricCard label="Proses Aktif" value={stats.aktif} icon="🔄" />
        <MetricCard label="Diterima" value={stats.diterima} icon="✅" />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Tutup' : '➕ Tambah Kandidat'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="section-title">➕ Kandidat Baru</div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Nama Kandidat *</label>
              <input className="form-input" value={form.nama} onChange={e => setForm({ ...form, nama: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Posisi Dilamar *</label>
              <input className="form-input" value={form.posisi} onChange={e => setForm({ ...form, posisi: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Tanggal Melamar</label>
              <input className="form-input" type="date" value={form.tgl_melamar} onChange={e => setForm({ ...form, tgl_melamar: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                {REKRUTMEN_STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Catatan</label>
            <textarea className="form-textarea" value={form.catatan} onChange={e => setForm({ ...form, catatan: e.target.value })} />
          </div>
          <button className="btn btn-primary" onClick={save} disabled={saving}>
            {saving ? <span className="spinner" /> : '💾 Simpan'}
          </button>
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : rows.length === 0 ? (
        <EmptyState icon="🎯" message="Belum ada kandidat." />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Nama</th><th>Posisi</th><th>Tgl Melamar</th><th>Status</th><th>Catatan</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 700 }}>{r.nama}</td>
                  <td>{r.posisi}</td>
                  <td className="mono">{r.tgl_melamar || '-'}</td>
                  <td><StatusBadge label={r.status} config={REKRUTMEN_STATUS_BADGE[r.status]} /></td>
                  <td style={{ color: 'var(--muted)', maxWidth: 200 }}>{r.catatan || '-'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <select
                        className="form-select"
                        style={{ padding: '4px 8px', fontSize: '0.75rem', width: 'auto' }}
                        value={r.status}
                        onChange={e => updateStatus(r.id, e.target.value)}
                      >
                        {REKRUTMEN_STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
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

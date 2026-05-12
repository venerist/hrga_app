'use client'
import { useState, useEffect } from 'react'
import { leaveService } from '@/services/leave.service'
import { MetricCard, PageHeader, StatusBadge, EmptyState, LoadingSpinner } from '@/components/ui'
import type { Cuti, CutiStatus } from '@/types/leave.types'
import { CUTI_JENIS_OPTIONS, CUTI_STATUS_OPTIONS, CUTI_JENIS_BADGE, CUTI_STATUS_BADGE } from '@/types/leave.types'

export default function CutiPage() {
  const [rows, setRows] = useState<Cuti[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    nama: '', jenis: 'Cuti Tahunan', tgl_mulai: '', tgl_selesai: '', alasan: ''
  })

  async function load() {
    setLoading(true)
    try {
      const data = await leaveService.getAll()
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
      await leaveService.create(form)
      setShowForm(false)
      setForm({ nama: '', jenis: 'Cuti Tahunan', tgl_mulai: '', tgl_selesai: '', alasan: '' })
      load()
    } catch (e: any) {
      alert(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function updateStatus(id: string, status: string) {
    await leaveService.updateStatus(id, status as CutiStatus)
    load()
  }

  async function hapus(id: string) {
    if (!confirm('Hapus data cuti ini?')) return
    await leaveService.delete(id)
    load()
  }

  const stats = leaveService.getStats(rows)

  return (
    <div>
      <PageHeader icon="📅" title="Cuti & Izin" subtitle="Manajemen pengajuan cuti karyawan" />

      <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 16 }}>
        <MetricCard label="Total Pengajuan" value={stats.total} icon="📋" />
        <MetricCard label="Total Hari" value={stats.totalHari} icon="📆" />
        <MetricCard label="Pending" value={stats.pending} icon="⏳" />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Tutup' : '➕ Ajukan Cuti / Izin'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="section-title">➕ Form Pengajuan</div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Nama Karyawan *</label>
              <input className="form-input" value={form.nama} onChange={e => setForm({ ...form, nama: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Jenis</label>
              <select className="form-select" value={form.jenis} onChange={e => setForm({ ...form, jenis: e.target.value })}>
                {CUTI_JENIS_OPTIONS.map(j => <option key={j}>{j}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Tanggal Mulai *</label>
              <input className="form-input" type="date" value={form.tgl_mulai} onChange={e => setForm({ ...form, tgl_mulai: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Tanggal Selesai *</label>
              <input className="form-input" type="date" value={form.tgl_selesai} onChange={e => setForm({ ...form, tgl_selesai: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Alasan / Keterangan</label>
            <textarea className="form-textarea" value={form.alasan} onChange={e => setForm({ ...form, alasan: e.target.value })} />
          </div>
          <button className="btn btn-primary" onClick={save} disabled={saving}>
            {saving ? <span className="spinner" /> : '💾 Simpan'}
          </button>
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : rows.length === 0 ? (
        <EmptyState icon="📅" message="Belum ada pengajuan cuti." />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Nama</th><th>Jenis</th><th>Mulai</th><th>Selesai</th><th>Durasi</th><th>Status</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 700 }}>{r.nama}</td>
                  <td><StatusBadge label={r.jenis} config={CUTI_JENIS_BADGE[r.jenis]} /></td>
                  <td className="mono">{r.tgl_mulai}</td>
                  <td className="mono">{r.tgl_selesai}</td>
                  <td className="mono">{r.durasi_hari} hari</td>
                  <td><StatusBadge label={r.status} config={CUTI_STATUS_BADGE[r.status]} /></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <select
                        className="form-select"
                        style={{ padding: '4px 8px', fontSize: '0.75rem', width: 'auto' }}
                        value={r.status}
                        onChange={e => updateStatus(r.id, e.target.value)}
                      >
                        {CUTI_STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
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

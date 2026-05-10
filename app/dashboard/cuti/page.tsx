'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const JENIS_OPTS = ['Cuti Tahunan','Cuti Sakit','Izin Pribadi','Cuti Melahirkan','Cuti Penting']

export default function CutiPage() {
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    nama: '', jenis: 'Cuti Tahunan', tgl_mulai: '', tgl_selesai: '', alasan: ''
  })

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('cuti').select('*').order('created_at', { ascending: false })
    setRows(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function save() {
    if (!form.nama) return alert('Nama wajib diisi.')
    if (!form.tgl_mulai || !form.tgl_selesai) return alert('Tanggal wajib diisi.')
    const durasi = Math.max(1, (new Date(form.tgl_selesai).getTime() - new Date(form.tgl_mulai).getTime()) / 86400000 + 1)
    setSaving(true)
    await supabase.from('cuti').insert({ ...form, durasi_hari: durasi, status: 'Pending' })
    setSaving(false)
    setShowForm(false)
    setForm({ nama: '', jenis: 'Cuti Tahunan', tgl_mulai: '', tgl_selesai: '', alasan: '' })
    load()
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from('cuti').update({ status }).eq('id', id)
    load()
  }

  async function hapus(id: string) {
    if (!confirm('Hapus data cuti ini?')) return
    await supabase.from('cuti').delete().eq('id', id)
    load()
  }

  const jenisBadge = (j: string) => {
    const map: Record<string, string> = {
      'Cuti Tahunan': 'badge-blue', 'Cuti Sakit': 'badge-red',
      'Izin Pribadi': 'badge-yellow', 'Cuti Melahirkan': 'badge-orange', 'Cuti Penting': 'badge-gray'
    }
    return <span className={`badge ${map[j] || 'badge-gray'}`}>{j}</span>
  }

  const statusBadge = (s: string) => {
    const map: Record<string, string> = { Pending: 'badge-yellow', Disetujui: 'badge-green', Ditolak: 'badge-red' }
    return <span className={`badge ${map[s] || 'badge-gray'}`}>{s}</span>
  }

  return (
    <div>
      <div className="page-header">
        <h1>📅 Cuti & Izin</h1>
        <p>Manajemen pengajuan cuti karyawan</p>
      </div>

      <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 16 }}>
        <div className="metric-card"><div className="metric-label">📋 Total Pengajuan</div><div className="metric-value">{rows.length}</div></div>
        <div className="metric-card"><div className="metric-label">📆 Total Hari</div><div className="metric-value">{rows.reduce((s, r) => s + (r.durasi_hari || 0), 0)}</div></div>
        <div className="metric-card"><div className="metric-label">⏳ Pending</div><div className="metric-value">{rows.filter(r => r.status === 'Pending').length}</div></div>
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
                {JENIS_OPTS.map(j => <option key={j}>{j}</option>)}
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
        <div style={{ textAlign: 'center', padding: 40 }}><span className="spinner" /></div>
      ) : rows.length === 0 ? (
        <div className="empty-state"><div className="icon">📅</div><p>Belum ada pengajuan cuti.</p></div>
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
                  <td>{jenisBadge(r.jenis)}</td>
                  <td className="mono">{r.tgl_mulai}</td>
                  <td className="mono">{r.tgl_selesai}</td>
                  <td className="mono">{r.durasi_hari} hari</td>
                  <td>{statusBadge(r.status)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <select
                        className="form-select"
                        style={{ padding: '4px 8px', fontSize: '0.75rem', width: 'auto' }}
                        value={r.status}
                        onChange={e => updateStatus(r.id, e.target.value)}
                      >
                        {['Pending','Disetujui','Ditolak'].map(s => <option key={s}>{s}</option>)}
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

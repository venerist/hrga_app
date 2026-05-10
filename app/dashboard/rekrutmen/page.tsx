'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const STATUS_OPTS = ['Screening','Interview','Tes Tertulis','Offering','Diterima','Ditolak']

const statusBadge = (s: string) => {
  const map: Record<string, string> = {
    Screening: 'badge-gray', Interview: 'badge-blue', 'Tes Tertulis': 'badge-yellow',
    Offering: 'badge-orange', Diterima: 'badge-green', Ditolak: 'badge-red'
  }
  return <span className={`badge ${map[s] || 'badge-gray'}`}>{s}</span>
}

export default function RekrutmenPage() {
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nama: '', posisi: '', tgl_melamar: '', status: 'Screening', catatan: '' })

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('rekrutmen').select('*').order('created_at', { ascending: false })
    setRows(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function save() {
    if (!form.nama || !form.posisi) return alert('Nama dan Posisi wajib diisi.')
    setSaving(true)
    await supabase.from('rekrutmen').insert({ ...form, tgl_melamar: form.tgl_melamar || null })
    setSaving(false)
    setShowForm(false)
    setForm({ nama: '', posisi: '', tgl_melamar: '', status: 'Screening', catatan: '' })
    load()
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from('rekrutmen').update({ status }).eq('id', id)
    load()
  }

  async function hapus(id: string) {
    if (!confirm('Hapus kandidat ini?')) return
    await supabase.from('rekrutmen').delete().eq('id', id)
    load()
  }

  const aktif = rows.filter(r => !['Diterima','Ditolak'].includes(r.status)).length

  return (
    <div>
      <div className="page-header">
        <h1>🎯 Rekrutmen</h1>
        <p>Pipeline kandidat & status seleksi</p>
      </div>

      <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 16 }}>
        <div className="metric-card"><div className="metric-label">👥 Total Kandidat</div><div className="metric-value">{rows.length}</div></div>
        <div className="metric-card"><div className="metric-label">🔄 Proses Aktif</div><div className="metric-value">{aktif}</div></div>
        <div className="metric-card"><div className="metric-label">✅ Diterima</div><div className="metric-value">{rows.filter(r => r.status === 'Diterima').length}</div></div>
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
                {STATUS_OPTS.map(s => <option key={s}>{s}</option>)}
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
        <div style={{ textAlign: 'center', padding: 40 }}><span className="spinner" /></div>
      ) : rows.length === 0 ? (
        <div className="empty-state"><div className="icon">🎯</div><p>Belum ada kandidat.</p></div>
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
                  <td>{statusBadge(r.status)}</td>
                  <td style={{ color: 'var(--muted)', maxWidth: 200 }}>{r.catatan || '-'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <select
                        className="form-select"
                        style={{ padding: '4px 8px', fontSize: '0.75rem', width: 'auto' }}
                        value={r.status}
                        onChange={e => updateStatus(r.id, e.target.value)}
                      >
                        {STATUS_OPTS.map(s => <option key={s}>{s}</option>)}
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

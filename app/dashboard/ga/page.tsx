'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const KATEGORI_OPTS = ['Alat Tulis Kantor','Perawatan Aset','Kendaraan','IT Support','Kebersihan','Lainnya']
const PRIORITAS_OPTS = ['Normal','Urgent','Critical']

function prioritasBadge(p: string) {
  const map: Record<string, string> = { Normal: 'badge-gray', Urgent: 'badge-orange', Critical: 'badge-red' }
  return <span className={`badge ${map[p] || 'badge-gray'}`}>{p}</span>
}

function statusBadge(s: string) {
  const map: Record<string, string> = { Open: 'badge-blue', 'In Progress': 'badge-yellow', Done: 'badge-green', Cancelled: 'badge-gray' }
  return <span className={`badge ${map[s] || 'badge-gray'}`}>{s}</span>
}

export default function GaPage() {
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ pemohon: '', kategori: 'Alat Tulis Kantor', deskripsi: '', prioritas: 'Normal', tanggal: '' })

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('ga').select('*').order('created_at', { ascending: false })
    setRows(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function save() {
    if (!form.pemohon || !form.deskripsi) return alert('Pemohon dan Deskripsi wajib diisi.')
    setSaving(true)
    await supabase.from('ga').insert({ ...form, tanggal: form.tanggal || null, status: 'Open' })
    setSaving(false)
    setShowForm(false)
    setForm({ pemohon: '', kategori: 'Alat Tulis Kantor', deskripsi: '', prioritas: 'Normal', tanggal: '' })
    load()
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from('ga').update({ status }).eq('id', id)
    load()
  }

  async function hapus(id: string) {
    if (!confirm('Hapus tiket ini?')) return
    await supabase.from('ga').delete().eq('id', id)
    load()
  }

  return (
    <div>
      <div className="page-header">
        <h1>🔧 General Affairs</h1>
        <p>Log permintaan & pemeliharaan aset kantor</p>
      </div>

      <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 16 }}>
        <div className="metric-card"><div className="metric-label">🎫 Total Tiket</div><div className="metric-value">{rows.length}</div></div>
        <div className="metric-card"><div className="metric-label">🔄 Open</div><div className="metric-value">{rows.filter(r => r.status === 'Open').length}</div></div>
        <div className="metric-card"><div className="metric-label">🚨 Urgent/Critical</div><div className="metric-value">{rows.filter(r => ['Urgent','Critical'].includes(r.prioritas)).length}</div></div>
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
                {KATEGORI_OPTS.map(k => <option key={k}>{k}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Prioritas</label>
              <select className="form-select" value={form.prioritas} onChange={e => setForm({ ...form, prioritas: e.target.value })}>
                {PRIORITAS_OPTS.map(p => <option key={p}>{p}</option>)}
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

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}><span className="spinner" /></div>
      ) : rows.length === 0 ? (
        <div className="empty-state"><div className="icon">🔧</div><p>Belum ada tiket GA.</p></div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Pemohon</th><th>Kategori</th><th>Deskripsi</th><th>Prioritas</th><th>Tanggal</th><th>Status</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 700 }}>{r.pemohon}</td>
                  <td><span className="badge badge-gray">{r.kategori}</span></td>
                  <td style={{ maxWidth: 240, color: 'var(--muted)' }}>{r.deskripsi}</td>
                  <td>{prioritasBadge(r.prioritas)}</td>
                  <td className="mono">{r.tanggal || '-'}</td>
                  <td>{statusBadge(r.status)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <select
                        className="form-select"
                        style={{ padding: '4px 8px', fontSize: '0.75rem', width: 'auto' }}
                        value={r.status}
                        onChange={e => updateStatus(r.id, e.target.value)}
                      >
                        {['Open','In Progress','Done','Cancelled'].map(s => <option key={s}>{s}</option>)}
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

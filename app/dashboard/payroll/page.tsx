'use client'
import { useState, useCallback, useRef } from 'react'
import * as XLSX from 'xlsx'
import { supabase } from '@/lib/supabase'
import { prosesFingerprint, rekapPerKaryawan, type AbsensiRecord } from '@/lib/fingerprint'

type Tab = 'ringkasan' | 'terlambat' | 'tap1x' | 'absensi'

function statusBadge(status: string) {
  const map: Record<string, string> = {
    'Tepat Waktu': 'badge-green',
    'Terlambat':   'badge-red',
    'Tap Masuk':   'badge-yellow',
    'Tap Keluar':  'badge-yellow',
    'Shift':       'badge-blue',
  }
  const emoji: Record<string, string> = {
    'Tepat Waktu': '✅', 'Terlambat': '⚠️', 'Tap Masuk': '🟡', 'Tap Keluar': '🟡', 'Shift': '🌙',
  }
  return <span className={`badge ${map[status] || 'badge-gray'}`}>{emoji[status] || ''} {status}</span>
}

export default function PayrollPage() {
  const [tab, setTab] = useState<Tab>('ringkasan')
  const [data, setData] = useState<AbsensiRecord[]>([])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [dragover, setDragover] = useState(false)
  const [filterNama, setFilterNama] = useState('Semua')
  const [filterTgl, setFilterTgl] = useState('Semua')
  const [tap1Info, setTap1Info] = useState({ count: 0, pct: 0 })
  const [periode, setPeriode] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback(async (file: File) => {
    setUploading(true)
    setSaved(false)
    try {
      const buf = await file.arrayBuffer()
      const wb = XLSX.read(buf, { type: 'array', cellDates: true })
      const ws = wb.Sheets[wb.SheetNames[0]]
      const raw = XLSX.utils.sheet_to_json(ws, { raw: false }) as any[]

      const processed = prosesFingerprint(raw)
      setData(processed)
      const tap1 = processed.filter(r => r.status === 'Tap Masuk' || r.status === 'Tap Keluar').length
      setTap1Info({ count: tap1, pct: processed.length ? Math.round(tap1 / processed.length * 100) : 0 })
      if (processed.length > 0) setPeriode(processed[0].periode)
    } finally {
      setUploading(false)
    }
  }, [])

  async function saveToSupabase() {
    setSaving(true)
    try {
      // Hapus data periode ini dulu, lalu insert baru
      await supabase.from('absensi').delete().eq('periode', periode)
      const { error } = await supabase.from('absensi').insert(data)
      if (error) throw error
      setSaved(true)
    } catch (e: any) {
      alert('Gagal simpan: ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  function downloadExcel() {
    const rekap = rekapPerKaryawan(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rekap), 'Rekap Karyawan')
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data), 'Detail Harian')
    XLSX.writeFile(wb, `rekap_absensi_${periode}.xlsx`)
  }

  // Filter
  const namaList = ['Semua', ...Array.from(new Set(data.map(d => d.nama))).sort()]
  const tglList  = ['Semua', ...Array.from(new Set(data.map(d => d.tanggal))).sort()]
  const df = data
    .filter(r => filterNama === 'Semua' || r.nama === filterNama)
    .filter(r => filterTgl === 'Semua' || r.tanggal === filterTgl)

  const rekap     = rekapPerKaryawan(df)
  const terlambatData = df.filter(r => r.status === 'Terlambat').sort((a, b) => b.menit_terlambat - a.menit_terlambat)
  const tap1Data  = df.filter(r => r.status === 'Tap Masuk' || r.status === 'Tap Keluar')

  return (
    <div>
      <div className="page-header">
        <h1>💰 Payroll & Absensi</h1>
        <p>Proses data fingerprint — terlambat, tap 1x, ketidakhadiran</p>
      </div>

      {/* Upload Zone */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="section-title">📤 Upload File Fingerprint (.xls / .xlsx)</div>
        <div
          className={`upload-zone ${dragover ? 'dragover' : ''}`}
          onClick={() => fileRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragover(true) }}
          onDragLeave={() => setDragover(false)}
          onDrop={e => {
            e.preventDefault(); setDragover(false)
            const f = e.dataTransfer.files[0]
            if (f) processFile(f)
          }}
        >
          {uploading
            ? <><span className="spinner" /><p style={{ marginTop: 12, color: 'var(--muted)' }}>Memproses file...</p></>
            : <>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>📂</div>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>Drag & drop atau klik untuk pilih file</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Format: .xls atau .xlsx dari mesin fingerprint</div>
            </>
          }
          <input
            ref={fileRef} type="file" accept=".xls,.xlsx" style={{ display: 'none' }}
            onChange={e => { const f = e.target.files?.[0]; if (f) processFile(f) }}
          />
        </div>

        {data.length > 0 && (
          <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="alert alert-success" style={{ margin: 0, flex: 1 }}>
              ✅ <strong>{data.length} record</strong> dari <strong>{new Set(data.map(d => d.nama)).size} karyawan</strong> berhasil diproses.
              {tap1Info.count > 0 && <span style={{ marginLeft: 8 }}>⚠️ {tap1Info.count} data tap 1x ({tap1Info.pct}%)</span>}
            </div>
            <button className="btn btn-outline btn-sm" onClick={downloadExcel}>⬇️ Download Excel</button>
            <button className="btn btn-primary btn-sm" onClick={saveToSupabase} disabled={saving}>
              {saving ? <span className="spinner" /> : saved ? '✅ Tersimpan' : '💾 Simpan ke Database'}
            </button>
          </div>
        )}
      </div>

      {data.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📋</div>
          <p>Upload file fingerprint untuk mulai memproses data absensi</p>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="grid-2" style={{ marginBottom: 16 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">👤 Filter Karyawan</label>
              <select className="form-select" value={filterNama} onChange={e => setFilterNama(e.target.value)}>
                {namaList.map(n => <option key={n}>{n}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">📅 Filter Tanggal</label>
              <select className="form-select" value={filterTgl} onChange={e => setFilterTgl(e.target.value)}>
                {tglList.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs">
            {([
              ['ringkasan', '📊 Ringkasan'],
              ['terlambat', `⚠️ Terlambat (${terlambatData.length})`],
              ['tap1x',     `🟡 Tap 1x (${tap1Data.length})`],
              ['absensi',   '🚫 Ketidakhadiran'],
            ] as [Tab, string][]).map(([key, label]) => (
              <button key={key} className={`tab ${tab === key ? 'active' : ''}`} onClick={() => setTab(key)}>{label}</button>
            ))}
          </div>

          {/* TAB: Ringkasan */}
          {tab === 'ringkasan' && (
            <>
              <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 16 }}>
                <div className="metric-card"><div className="metric-label">👥 Karyawan</div><div className="metric-value">{rekap.length}</div></div>
                <div className="metric-card"><div className="metric-label">📈 Avg Hadir</div><div className="metric-value">{rekap.length ? Math.round(rekap.reduce((s, r) => s + r.pct_kehadiran, 0) / rekap.length) : 0}%</div></div>
                <div className="metric-card"><div className="metric-label">⚠️ Terlambat</div><div className="metric-value">{rekap.reduce((s, r) => s + r.terlambat, 0)}</div></div>
                <div className="metric-card"><div className="metric-label">⏱️ Total Mnt</div><div className="metric-value">{rekap.reduce((s, r) => s + r.total_mnt_telat, 0)}</div></div>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Nama</th><th>Dept</th><th>Hadir</th><th>Absen</th>
                      <th>% Hadir</th><th>Terlambat</th><th>Total Mnt Telat</th><th>Tap 1x</th><th>Avg Jam</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rekap.map((r, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 700 }}>{r.nama}</td>
                        <td style={{ color: 'var(--muted)' }}>{r.departemen}</td>
                        <td className="mono">{r.hari_hadir}</td>
                        <td><span className={`badge ${r.tidak_hadir > 0 ? 'badge-red' : 'badge-green'}`}>{r.tidak_hadir}</span></td>
                        <td className="mono">{r.pct_kehadiran}%</td>
                        <td><span className={`badge ${r.terlambat > 0 ? 'badge-orange' : 'badge-green'}`}>{r.terlambat}</span></td>
                        <td className="mono" style={{ color: r.total_mnt_telat > 0 ? 'var(--err)' : 'inherit', fontWeight: r.total_mnt_telat > 30 ? 700 : 400 }}>{r.total_mnt_telat} mnt</td>
                        <td><span className={`badge ${r.tap_1x > 0 ? 'badge-yellow' : 'badge-gray'}`}>{r.tap_1x}</span></td>
                        <td className="mono">{r.avg_jam || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* TAB: Terlambat */}
          {tab === 'terlambat' && (
            <>
              <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 16 }}>
                <div className="metric-card"><div className="metric-label">⚠️ Kejadian</div><div className="metric-value">{terlambatData.length}</div></div>
                <div className="metric-card"><div className="metric-label">⏱️ Total Menit</div><div className="metric-value">{terlambatData.reduce((s, r) => s + r.menit_terlambat, 0)}</div></div>
                <div className="metric-card"><div className="metric-label">👥 Karyawan</div><div className="metric-value">{new Set(terlambatData.map(r => r.nama)).size}</div></div>
              </div>
              <div className="alert alert-warning">⏰ Toleransi keterlambatan: <strong>5 menit</strong> dari jam 08:00. Merah = &gt;30 menit.</div>
              {terlambatData.length === 0
                ? <div className="empty-state"><div className="icon">🎉</div><p>Tidak ada keterlambatan!</p></div>
                : (
                  <div className="table-wrap">
                    <table>
                      <thead><tr><th>Nama</th><th>Tanggal</th><th>Jam Masuk</th><th>Menit Terlambat</th><th>Durasi Kerja</th></tr></thead>
                      <tbody>
                        {terlambatData.map((r, i) => (
                          <tr key={i}>
                            <td style={{ fontWeight: 700 }}>{r.nama}</td>
                            <td className="mono">{r.tanggal}</td>
                            <td className="mono">{r.jam_masuk_str}</td>
                            <td>
                              <span className={`badge ${r.menit_terlambat > 30 ? 'badge-red' : 'badge-orange'}`} style={{ fontWeight: 800 }}>
                                {r.menit_terlambat} mnt
                              </span>
                            </td>
                            <td className="mono">{r.durasi_jam !== null ? `${r.durasi_jam} jam` : '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              }
            </>
          )}

          {/* TAB: Tap 1x */}
          {tab === 'tap1x' && (
            <>
              <div className="alert alert-warning">
                🟡 <strong>Tap 1x</strong> = karyawan hanya tap sekali pada hari tersebut. Kemungkinan lupa tap, atau mesin tidak merekam tap kedua. Tetap dihitung <strong>hadir</strong>, namun perlu tindak lanjut.
              </div>
              <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 16 }}>
                <div className="metric-card"><div className="metric-label">🟡 Total Kejadian</div><div className="metric-value">{tap1Data.length}</div></div>
                <div className="metric-card"><div className="metric-label">👥 Karyawan</div><div className="metric-value">{new Set(tap1Data.map(r => r.nama)).size}</div></div>
                <div className="metric-card"><div className="metric-label">% dari Total</div><div className="metric-value">{data.length ? Math.round(tap1Data.length / data.length * 100) : 0}%</div></div>
              </div>
              {tap1Data.length === 0
                ? <div className="empty-state"><div className="icon">🎉</div><p>Tidak ada data tap 1x!</p></div>
                : (
                  <div className="table-wrap">
                    <table>
                      <thead><tr><th>Nama</th><th>Departemen</th><th>Tanggal</th><th>Waktu Tap</th><th>Keterangan</th></tr></thead>
                      <tbody>
                        {tap1Data.sort((a, b) => a.nama.localeCompare(b.nama)).map((r, i) => (
                          <tr key={i}>
                            <td style={{ fontWeight: 700 }}>{r.nama}</td>
                            <td style={{ color: 'var(--muted)' }}>{r.departemen}</td>
                            <td className="mono">{r.tanggal}</td>
                            <td className="mono">{r.jam_masuk_str}</td>
                            <td>{statusBadge(r.status)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              }
            </>
          )}

          {/* TAB: Ketidakhadiran */}
          {tab === 'absensi' && (
            <AbsensiTab data={data} df={df} />
          )}
        </>
      )}
    </div>
  )
}

function AbsensiTab({ data, df }: { data: AbsensiRecord[]; df: AbsensiRecord[] }) {
  const allTanggal = Array.from(new Set(data.map(d => d.tanggal))).sort()
  const allNama    = Array.from(new Set(data.map(d => d.nama))).sort()
  const hadirSet   = new Set(df.map(r => `${r.nama}__${r.tanggal}`))

  const records: { nama: string; tanggal: string }[] = []
  for (const nama of allNama) {
    for (const tgl of allTanggal) {
      if (!hadirSet.has(`${nama}__${tgl}`)) records.push({ nama, tanggal: tgl })
    }
  }

  return (
    <>
      <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 16 }}>
        <div className="metric-card"><div className="metric-label">🚫 Total Ketidakhadiran</div><div className="metric-value">{records.length}</div></div>
        <div className="metric-card"><div className="metric-label">👥 Karyawan Terdampak</div><div className="metric-value">{new Set(records.map(r => r.nama)).size}</div></div>
        <div className="metric-card"><div className="metric-label">📆 Hari Dipantau</div><div className="metric-value">{allTanggal.length}</div></div>
      </div>
      {records.length === 0
        ? <div className="empty-state"><div className="icon">🎉</div><p>Semua karyawan hadir setiap hari!</p></div>
        : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Nama</th><th>Tanggal</th><th>Keterangan</th></tr></thead>
              <tbody>
                {records.map((r, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 700 }}>{r.nama}</td>
                    <td className="mono">{r.tanggal}</td>
                    <td><span className="badge badge-red">🚫 Tidak Hadir</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
    </>
  )
}

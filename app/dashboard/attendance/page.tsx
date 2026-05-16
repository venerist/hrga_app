'use client'
import { useState, useCallback, useRef } from 'react'
import * as XLSX from 'xlsx'
import { attendanceService } from '@/services/attendance.service'
import { MetricCard, PageHeader, StatusBadge, EmptyState } from '@/components/ui'
import type { Absensi, RawFingerprintRecord } from '@/types/attendance.types'
import { Upload, Download, Save, CheckCircle } from 'lucide-react'
import { toast } from '@/lib/toast'

import { RingkasanTab, TerlambatTab, Tap1xTab, AbsensiTab } from '@/components/features/attendance'

type Tab = 'ringkasan' | 'terlambat' | 'tap1x' | 'absensi'

export default function AttendancePage() {
  const [tab, setTab] = useState<Tab>('ringkasan')
  const [data, setData] = useState<Omit<Absensi, 'id' | 'created_at'>[]>([])
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
    setUploading(true); setSaved(false)
    try {
      const buf = await file.arrayBuffer()
      const wb = XLSX.read(buf, { type: 'array', cellDates: true })
      const raw = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { raw: false }) as RawFingerprintRecord[]
      const processed = attendanceService.processFingerprint(raw)
      setData(processed)
      setTap1Info(attendanceService.calculateTap1xStats(processed))
      if (processed.length > 0) setPeriode(processed[0].periode)
    } finally { setUploading(false) }
  }, [])

  async function saveToSupabase() {
    setSaving(true)
    try { await attendanceService.saveToDatabase(data, periode); setSaved(true) }
    catch (e: any) { alert('Gagal simpan: ' + e.message) }
    finally { setSaving(false) }
  }

  function formatDurasi(menit: number): string {
    if (menit <= 0) return '-'
    const jam = Math.floor(menit / 60)
    const sisa = menit % 60
    if (jam > 0 && sisa > 0) return `${jam} jam ${sisa} menit`
    if (jam > 0) return `${jam} jam`
    return `${sisa} menit`
  }

  function formatTanggalID(dateStr: string): string {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  function getHariID(dateStr: string): string {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return '-'
    return d.toLocaleDateString('id-ID', { weekday: 'long' })
  }

  function downloadExcel() {
    try {
      const JAM_MASUK_NORMAL = '08:00'
      const wb = XLSX.utils.book_new()
      const totalHariKerja = new Set(df.map(r => r.tanggal)).size

      // === Sheet 1: Rekap Ringkasan ===
      const rekapRows = rekap.map((r, i) => ({
        'No': i + 1,
        'NIK': df.find(d => d.nama === r.nama)?.no_id ?? '-',
        'Nama': r.nama,
        'Divisi': r.departemen,
        'Jabatan': '-',
        'Total Hari Kerja': totalHariKerja,
        'Total Hadir': r.hari_hadir,
        'Total Tidak Hadir': r.tidak_hadir,
        'Total Terlambat': r.terlambat,
        'Total Menit Terlambat': r.total_mnt_telat,
        'Rata-rata Menit Terlambat': r.terlambat > 0 ? Math.round(r.total_mnt_telat / r.terlambat) : 0,
        'Persentase Kehadiran': `${r.pct_kehadiran}%`,
      }))
      const wsRekap = XLSX.utils.json_to_sheet(rekapRows)
      wsRekap['!cols'] = [
        { wch: 5 }, { wch: 15 }, { wch: 25 }, { wch: 18 }, { wch: 18 },
        { wch: 14 }, { wch: 12 }, { wch: 15 }, { wch: 14 }, { wch: 18 }, { wch: 20 }, { wch: 18 },
      ]
      wsRekap['!freeze'] = { xSplit: 0, ySplit: 1 }
      XLSX.utils.book_append_sheet(wb, wsRekap, 'Rekap Ringkasan')

      // === Sheet 2: Detail Keterlambatan ===
      const lateRows = df
        .filter(r => r.menit_terlambat > 0)
        .sort((a, b) => a.tanggal.localeCompare(b.tanggal))
        .map((r, i) => ({
          'No': i + 1,
          'Tanggal': formatTanggalID(r.tanggal),
          'Hari': getHariID(r.tanggal),
          'NIK': r.no_id,
          'Nama': r.nama,
          'Divisi': r.departemen,
          'Jabatan': '-',
          'Jam Masuk Normal': JAM_MASUK_NORMAL,
          'Jam Scan Masuk': r.jam_masuk_str,
          'Durasi Keterlambatan': formatDurasi(r.menit_terlambat),
          'Total Menit Terlambat': r.menit_terlambat,
          'Status': r.status,
        }))
      const wsLate = XLSX.utils.json_to_sheet(lateRows)
      wsLate['!cols'] = [
        { wch: 5 }, { wch: 14 }, { wch: 10 }, { wch: 15 }, { wch: 25 },
        { wch: 18 }, { wch: 18 }, { wch: 16 }, { wch: 16 }, { wch: 22 }, { wch: 18 }, { wch: 14 },
      ]
      wsLate['!freeze'] = { xSplit: 0, ySplit: 1 }
      XLSX.utils.book_append_sheet(wb, wsLate, 'Detail Keterlambatan')

      // === Sheet 3: Detail Absensi Harian ===
      const dailyRows = df
        .sort((a, b) => a.tanggal.localeCompare(b.tanggal) || a.nama.localeCompare(b.nama))
        .map((r, i) => {
          const statusKehadiran = r.status === 'Absent' ? 'Tidak Hadir' : 'Hadir'
          const statusTerlambat = r.menit_terlambat > 0 ? 'Terlambat' : 'Tepat Waktu'
          let keterangan = ''
          if (r.jml_tap === 1) keterangan = 'Hanya 1x tap'
          if (r.menit_terlambat > 30) keterangan = 'Terlambat signifikan'
          return {
            'No': i + 1,
            'Tanggal': formatTanggalID(r.tanggal),
            'Hari': getHariID(r.tanggal),
            'NIK': r.no_id,
            'Nama': r.nama,
            'Divisi': r.departemen,
            'Jabatan': '-',
            'Jam Scan Pertama': r.jam_masuk_str,
            'Jam Scan Terakhir': r.jam_keluar_str,
            'Status Kehadiran': statusKehadiran,
            'Status Keterlambatan': statusTerlambat,
            'Menit Terlambat': r.menit_terlambat,
            'Keterangan': keterangan,
          }
        })
      const wsDaily = XLSX.utils.json_to_sheet(dailyRows)
      wsDaily['!cols'] = [
        { wch: 5 }, { wch: 14 }, { wch: 10 }, { wch: 15 }, { wch: 25 },
        { wch: 18 }, { wch: 18 }, { wch: 16 }, { wch: 18 }, { wch: 16 },
        { wch: 18 }, { wch: 15 }, { wch: 22 },
      ]
      wsDaily['!freeze'] = { xSplit: 0, ySplit: 1 }
      XLSX.utils.book_append_sheet(wb, wsDaily, 'Detail Absensi Harian')

      // === Sheet 4: Matriks Kehadiran ===
      const allDates = Array.from(new Set(df.map(r => r.tanggal))).sort()
      const allNames = Array.from(new Set(df.map(r => r.nama))).sort()
      const matrixData: Record<string, string>[] = allNames.map(nama => {
        const row: Record<string, string> = { 'Nama Karyawan': nama }
        for (const tgl of allDates) {
          const rec = df.find(r => r.nama === nama && r.tanggal === tgl)
          const colLabel = tgl.slice(5) // MM-DD
          if (!rec) {
            row[colLabel] = 'A'
          } else if (rec.menit_terlambat > 0) {
            row[colLabel] = 'T'
          } else {
            row[colLabel] = 'H'
          }
        }
        return row
      })
      const wsMatrix = XLSX.utils.json_to_sheet(matrixData)
      const matCols: XLSX.ColInfo[] = [{ wch: 25 }]
      for (let i = 0; i < allDates.length; i++) matCols.push({ wch: 6 })
      wsMatrix['!cols'] = matCols
      wsMatrix['!freeze'] = { xSplit: 1, ySplit: 1 }
      XLSX.utils.book_append_sheet(wb, wsMatrix, 'Matriks Kehadiran')

      XLSX.writeFile(wb, `Rekap_Absensi_${periode || 'Export'}.xlsx`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal mengekspor Excel'
      toast.error(msg)
    }
  }

  const namaList = ['Semua', ...Array.from(new Set(data.map(d => d.nama))).sort()]
  const tglList = ['Semua', ...Array.from(new Set(data.map(d => d.tanggal))).sort()]
  const df = data.filter(r => filterNama === 'Semua' || r.nama === filterNama).filter(r => filterTgl === 'Semua' || r.tanggal === filterTgl)
  const rekap = attendanceService.calculateRekap(df)
  const terlambatData = df.filter(r => r.status === 'Terlambat').sort((a, b) => b.menit_terlambat - a.menit_terlambat)
  const tap1Data = df.filter(r => r.status === 'Tap Masuk' || r.status === 'Tap Keluar')

  const TABS: { key: Tab; label: string }[] = [
    { key: 'ringkasan', label: '📊 Ringkasan' },
    { key: 'terlambat', label: `⚠️ Terlambat (${terlambatData.length})` },
    { key: 'tap1x', label: `🟡 Tap 1x (${tap1Data.length})` },
    { key: 'absensi', label: '🚫 Ketidakhadiran' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader icon="📋" title="Attendance Management" subtitle="Upload absensi, monitoring kehadiran, rekap, dan export data." />

      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-sm font-bold text-dark mb-4 flex items-center gap-2"><Upload size={16} /> Upload File Fingerprint</h3>
        <div
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 ${dragover ? 'border-brand bg-brand-light scale-[1.01]' : 'border-border bg-surface hover:border-brand/50 hover:bg-brand-light/50'}`}
          onClick={() => fileRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragover(true) }}
          onDragLeave={() => setDragover(false)}
          onDrop={e => { e.preventDefault(); setDragover(false); const f = e.dataTransfer.files[0]; if (f) processFile(f) }}
        >
          {uploading
            ? <><span className="spinner" /><p className="mt-3 text-sm text-muted">Memproses file...</p></>
            : <>
              <div className="w-14 h-14 bg-brand/10 rounded-2xl flex items-center justify-center mx-auto mb-3"><Upload size={24} className="text-brand" /></div>
              <p className="font-semibold text-dark text-sm">Drag & drop atau klik untuk pilih file</p>
              <p className="text-xs text-muted mt-1">Format: .xls atau .xlsx dari mesin fingerprint</p>
            </>
          }
          <input ref={fileRef} type="file" accept=".xls,.xlsx" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) processFile(f) }} />
        </div>

        {data.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="flex-1 flex items-center gap-2 p-3 rounded-xl bg-emerald-50 text-emerald-800 text-sm border border-emerald-100">
              <CheckCircle size={16} /> <strong>{data.length} record</strong> dari <strong>{new Set(data.map(d => d.nama)).size} karyawan</strong> diproses.
              {tap1Info.count > 0 && <span className="ml-2 text-amber-700">⚠️ {tap1Info.count} tap 1x ({tap1Info.pct}%)</span>}
            </div>
            <button onClick={downloadExcel} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-card text-sm font-semibold text-dark hover:border-brand hover:text-brand transition-all cursor-pointer">
              <Download size={15} /> Excel
            </button>
            <button onClick={saveToSupabase} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition-all disabled:opacity-60 cursor-pointer shadow-md shadow-brand/15">
              {saving ? <span className="spinner" /> : saved ? <><CheckCircle size={15} /> Tersimpan</> : <><Save size={15} /> Simpan</>}
            </button>
          </div>
        )}
      </div>

      {data.length === 0 ? (
        <EmptyState icon="📋" message="Upload file fingerprint untuk mulai memproses data absensi" />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-dark mb-1.5">👤 Filter Karyawan</label>
              <select className="w-full px-3.5 py-2.5 rounded-xl border-[1.5px] border-border bg-card text-sm font-medium outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all" value={filterNama} onChange={e => setFilterNama(e.target.value)}>
                {namaList.map(n => <option key={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-dark mb-1.5">📅 Filter Tanggal</label>
              <select className="w-full px-3.5 py-2.5 rounded-xl border-[1.5px] border-border bg-card text-sm font-medium outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all" value={filterTgl} onChange={e => setFilterTgl(e.target.value)}>
                {tglList.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit flex-wrap">
            {TABS.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`px-4 py-2 rounded-lg text-[0.8rem] font-semibold transition-all cursor-pointer ${tab === t.key ? 'bg-card text-brand shadow-sm' : 'text-muted hover:text-dark'}`}>
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'ringkasan' && <RingkasanTab rekap={rekap} />}
          {tab === 'terlambat' && <TerlambatTab data={terlambatData} />}
          {tab === 'tap1x' && <Tap1xTab data={data} tap1Data={tap1Data} />}
          {tab === 'absensi' && <AbsensiTab data={data} df={df} />}
        </>
      )}
    </div>
  )
}

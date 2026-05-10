// Proses raw fingerprint data menjadi rekap per karyawan per hari

export interface RawRecord {
  Departemen?: string
  Nama: string
  'No.ID'?: string
  'Tgl/Waktu': string
}

export interface AbsensiRecord {
  departemen: string
  nama: string
  no_id: string
  tanggal: string
  jam_masuk: string
  jam_keluar: string
  jam_masuk_str: string
  jam_keluar_str: string
  durasi_jam: number | null
  shift: string
  menit_terlambat: number
  jml_tap: number
  status: string
  periode: string
}

const JAM_MASUK_STD = 8 * 60  // 08:00 dalam menit
const TOLERANSI = 5

function formatTime(d: Date) {
  return d.toTimeString().slice(0, 5)
}

function getPeriode(tanggal: string) {
  return tanggal.slice(0, 7) // "2026-03"
}

export function prosesFingerprint(rawData: RawRecord[]): AbsensiRecord[] {
  // Kelompokkan per (Nama, Tanggal)
  const grouped: Record<string, { departemen: string; nama: string; no_id: string; times: Date[] }> = {}

  for (const row of rawData) {
    if (!row['Nama'] || !row['Tgl/Waktu']) continue
    const dt = new Date(row['Tgl/Waktu'])
    if (isNaN(dt.getTime())) continue
    const tanggal = dt.toISOString().slice(0, 10)
    const key = `${row['Nama']}__${tanggal}`
    if (!grouped[key]) {
      grouped[key] = {
        departemen: row['Departemen'] || '-',
        nama: row['Nama'],
        no_id: row['No.ID'] || '-',
        times: []
      }
    }
    grouped[key].times.push(dt)
  }

  const results: AbsensiRecord[] = []

  for (const [key, val] of Object.entries(grouped)) {
    const tanggal = key.split('__')[1]
    const sorted = val.times.sort((a, b) => a.getTime() - b.getTime())
    const jamMasuk = sorted[0]
    const jamKeluar = sorted[sorted.length - 1]
    const jmlTap = sorted.length

    const jamMasukStr = formatTime(jamMasuk)
    const jamKeluarStr = formatTime(jamKeluar)

    const durasiJam = jmlTap >= 2
      ? (jamKeluar.getTime() - jamMasuk.getTime()) / 3600000
      : null

    const shift = jamMasuk.getHours() < 12 ? 'Pagi' : 'Siang/Malam'

    let menitTerlambat = 0
    if (shift === 'Pagi') {
      const menit = jamMasuk.getHours() * 60 + jamMasuk.getMinutes()
      menitTerlambat = Math.max(0, menit - JAM_MASUK_STD)
    }

    let status: string
    if (jmlTap === 1) {
      status = jamMasuk.getHours() < 11 ? 'Tap Masuk' : 'Tap Keluar'
    } else if (shift === 'Siang/Malam') {
      status = 'Shift'
    } else if (menitTerlambat > TOLERANSI) {
      status = 'Terlambat'
    } else {
      status = 'Tepat Waktu'
    }

    results.push({
      departemen: val.departemen,
      nama: val.nama,
      no_id: val.no_id,
      tanggal,
      jam_masuk: jamMasuk.toISOString(),
      jam_keluar: jamKeluar.toISOString(),
      jam_masuk_str: jamMasukStr,
      jam_keluar_str: jamKeluarStr,
      durasi_jam: durasiJam !== null ? Math.round(durasiJam * 100) / 100 : null,
      shift,
      menit_terlambat: menitTerlambat,
      jml_tap: jmlTap,
      status,
      periode: getPeriode(tanggal),
    })
  }

  return results
}

export function rekapPerKaryawan(data: AbsensiRecord[]) {
  const totalHari = new Set(data.map(d => d.tanggal)).size
  const grouped: Record<string, AbsensiRecord[]> = {}
  for (const r of data) {
    if (!grouped[r.nama]) grouped[r.nama] = []
    grouped[r.nama].push(r)
  }

  return Object.entries(grouped).map(([nama, rows]) => {
    const hariHadir = rows.length
    const terlambat = rows.filter(r => r.status === 'Terlambat').length
    const tap1x = rows.filter(r => r.status === 'Tap Masuk' || r.status === 'Tap Keluar').length
    const totalMntTelat = rows.reduce((s, r) => s + r.menit_terlambat, 0)
    const durasijs = rows.filter(r => r.durasi_jam !== null).map(r => r.durasi_jam as number)
    const avgJam = durasijs.length ? durasijs.reduce((a, b) => a + b, 0) / durasijs.length : 0
    return {
      nama,
      departemen: rows[0].departemen,
      hari_hadir: hariHadir,
      tidak_hadir: totalHari - hariHadir,
      pct_kehadiran: Math.round(hariHadir / totalHari * 1000) / 10,
      terlambat,
      tap_1x: tap1x,
      total_mnt_telat: totalMntTelat,
      avg_jam: Math.round(avgJam * 100) / 100,
    }
  }).sort((a, b) => b.total_mnt_telat - a.total_mnt_telat)
}

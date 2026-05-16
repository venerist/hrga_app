import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import * as XLSX from 'xlsx'

const MONTH_NAMES_ID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

function formatTime(value: string | null): string {
  if (!value) return '-'
  const date = new Date(value)
  if (isNaN(date.getTime())) return '-'
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

function formatDayName(value: string): string {
  const date = new Date(value)
  if (isNaN(date.getTime())) return '-'
  return date.toLocaleDateString('id-ID', { weekday: 'long' })
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const month = Number(url.searchParams.get('month'))
    const year = Number(url.searchParams.get('year'))

    if (!month || !year || month < 1 || month > 12) {
      return NextResponse.json({ error: 'month and year query parameters are required and must be valid.' }, { status: 400 })
    }

    const startDate = `${year}-${String(month).padStart(2, '0')}-01`
    const endDate = `${year}-${String(month).padStart(2, '0')}-31`

    const supabase = await createAdminClient()
    const [{ data: summaries, error: summaryError }, { data: employees, error: employeeError }] = await Promise.all([
      supabase
        .from('attendance_summary')
        .select('*')
        .gte('attendance_date', startDate)
        .lte('attendance_date', endDate)
        .order('attendance_date', { ascending: true }),
      supabase
        .from('employees')
        .select('nik,name')
    ])

    if (summaryError) throw summaryError
    if (employeeError) throw employeeError

    const employeeNames = Object.fromEntries((employees || []).map((emp: any) => [emp.nik, emp.name]))
    const reportMonth = MONTH_NAMES_ID[month - 1] ?? `${month}`
    const title = `LAPORAN KETERLAMBATAN KARYAWAN - ${reportMonth.toUpperCase()} ${year}`
    const subtitle = 'Jam Kerja: 08.00 - 16.00'

    const summaryByEmployee: Record<string, { nama: string; count: number; totalLate: number }> = {}
    const detailRows: any[] = []

    for (const row of summaries || []) {
      const nik = row.employee_nik
      const nama = employeeNames[nik] ?? nik
      const lateMinutes = row.late_minutes ?? 0

      if (!summaryByEmployee[nik]) {
        summaryByEmployee[nik] = { nama, count: 0, totalLate: 0 }
      }

      if (lateMinutes > 0) {
        summaryByEmployee[nik].count += 1
        summaryByEmployee[nik].totalLate += lateMinutes
      }

      detailRows.push({
        no: detailRows.length + 1,
        nama,
        tanggal: new Date(row.attendance_date),
        hari: formatDayName(row.attendance_date),
        jam_masuk: formatTime(row.check_in ?? null),
        keterlambatan: lateMinutes,
      })
    }

    const summaryRows = Object.values(summaryByEmployee).map((item, index) => {
      let keterangan = 'Jarang'
      if (item.count >= 10) keterangan = 'Sangat Sering'
      else if (item.count >= 6) keterangan = 'Sering'
      else if (item.count >= 3) keterangan = 'Cukup'

      return {
        no: index + 1,
        nama: item.nama,
        jumlah_hari_terlambat: item.count,
        total_durasi_keterlambatan: item.totalLate,
        keterangan,
      }
    })

    const wb = XLSX.utils.book_new()
    const wsSummary = XLSX.utils.json_to_sheet(summaryRows, { header: ['no', 'nama', 'jumlah_hari_terlambat', 'total_durasi_keterlambatan', 'keterangan'] })
    wsSummary['!cols'] = [{ wch: 6 }, { wch: 36 }, { wch: 20 }, { wch: 24 }, { wch: 18 }]
    wsSummary['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }, { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } }]
    XLSX.utils.sheet_add_aoa(wsSummary, [[title]], { origin: 'A1' })
    XLSX.utils.sheet_add_aoa(wsSummary, [[subtitle]], { origin: 'A2' })
    XLSX.utils.sheet_add_aoa(wsSummary, [['No', 'Nama Karyawan', 'Jumlah Hari Terlambat', 'Total Durasi Keterlambatan', 'Keterangan']], { origin: 'A4' })
    XLSX.utils.sheet_add_json(wsSummary, summaryRows, { origin: 'A5', skipHeader: true })

    const wsDetail = XLSX.utils.json_to_sheet(detailRows, { header: ['no', 'nama', 'tanggal', 'hari', 'jam_masuk', 'keterlambatan'] })
    wsDetail['!cols'] = [{ wch: 6 }, { wch: 36 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 18 }]
    wsDetail['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }, { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } }]
    XLSX.utils.sheet_add_aoa(wsDetail, [[`DETAIL KETERLAMBATAN PER KARYAWAN PER HARI - ${reportMonth.toUpperCase()} ${year}`]], { origin: 'A1' })
    XLSX.utils.sheet_add_aoa(wsDetail, [[subtitle]], { origin: 'A2' })
    XLSX.utils.sheet_add_aoa(wsDetail, [['No', 'Nama Karyawan', 'Tanggal', 'Hari', 'Jam Masuk', 'Keterlambatan']], { origin: 'A4' })
    XLSX.utils.sheet_add_json(wsDetail, detailRows, { origin: 'A5', skipHeader: true })

    XLSX.utils.book_append_sheet(wb, wsSummary, 'Ringkasan Keterlambatan')
    XLSX.utils.book_append_sheet(wb, wsDetail, 'Detail Keterlambatan')

    const xlsxBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' })
    const filename = `laporan-keterlambatan-${month}-${year}.xlsx`

    return new Response(Buffer.from(xlsxBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error: any) {
    console.error('Export attendance error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}

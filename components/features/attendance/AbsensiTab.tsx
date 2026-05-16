import { MetricCard, EmptyState } from '@/components/ui'
import type { Absensi } from '@/types/attendance.types'

interface AbsensiTabProps {
  data: Omit<Absensi, 'id' | 'created_at'>[]
  df: Omit<Absensi, 'id' | 'created_at'>[]
}

export function AbsensiTab({ data, df }: AbsensiTabProps) {
  const allTanggal = Array.from(new Set(data.map(d => d.tanggal))).sort()
  const allNama = Array.from(new Set(data.map(d => d.nama))).sort()
  const hadirSet = new Set(df.map(r => `${r.nama}__${r.tanggal}`))
  const records: { nama: string; tanggal: string }[] = []
  for (const nama of allNama) for (const tgl of allTanggal) if (!hadirSet.has(`${nama}__${tgl}`)) records.push({ nama, tanggal: tgl })

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard label="Total Ketidakhadiran" value={records.length} icon="🚫" />
        <MetricCard label="Karyawan Terdampak" value={new Set(records.map(r => r.nama)).size} icon="👥" />
        <MetricCard label="Hari Dipantau" value={allTanggal.length} icon="📆" />
      </div>
      {records.length === 0 ? <EmptyState icon="🎉" message="Semua karyawan hadir setiap hari!" /> : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden"><div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-surface">
              <th className="px-4 py-3 text-left text-[0.68rem] font-semibold text-muted uppercase tracking-wider">Nama</th>
              <th className="px-4 py-3 text-left text-[0.68rem] font-semibold text-muted uppercase tracking-wider">Tanggal</th>
              <th className="px-4 py-3 text-left text-[0.68rem] font-semibold text-muted uppercase tracking-wider">Keterangan</th>
            </tr></thead>
            <tbody className="divide-y divide-border/50">
              {records.map((r, i) => (
                <tr key={i} className="hover:bg-surface/60 transition-colors">
                  <td className="px-4 py-3 font-semibold text-dark">{r.nama}</td>
                  <td className="px-4 py-3 font-mono text-xs">{r.tanggal}</td>
                  <td className="px-4 py-3"><span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[0.68rem] font-semibold bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10">🚫 Tidak Hadir</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div></div>
      )}
    </div>
  )
}

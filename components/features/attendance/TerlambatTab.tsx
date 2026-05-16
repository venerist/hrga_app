import { MetricCard, EmptyState } from '@/components/ui'
import type { Absensi } from '@/types/attendance.types'

interface TerlambatTabProps {
  data: Omit<Absensi, 'id' | 'created_at'>[]
}

export function TerlambatTab({ data }: TerlambatTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard label="Kejadian" value={data.length} icon="⚠️" />
        <MetricCard label="Total Menit" value={data.reduce((s, r) => s + r.menit_terlambat, 0)} icon="⏱️" />
        <MetricCard label="Karyawan" value={new Set(data.map(r => r.nama)).size} icon="👥" />
      </div>
      <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 text-amber-800 text-sm border border-amber-100">⏰ Toleransi: <strong>5 menit</strong> dari 08:00. Merah = &gt;30 mnt.</div>
      {data.length === 0 ? <EmptyState icon="🎉" message="Tidak ada keterlambatan!" /> : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden"><div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-surface">
              <th className="px-4 py-3 text-left text-[0.68rem] font-semibold text-muted uppercase tracking-wider">Nama</th>
              <th className="px-4 py-3 text-left text-[0.68rem] font-semibold text-muted uppercase tracking-wider">Tanggal</th>
              <th className="px-4 py-3 text-left text-[0.68rem] font-semibold text-muted uppercase tracking-wider">Masuk</th>
              <th className="px-4 py-3 text-left text-[0.68rem] font-semibold text-muted uppercase tracking-wider">Mnt Telat</th>
              <th className="px-4 py-3 text-left text-[0.68rem] font-semibold text-muted uppercase tracking-wider">Durasi</th>
            </tr></thead>
            <tbody className="divide-y divide-border/50">
              {data.map((r, i) => (
                <tr key={i} className="hover:bg-surface/60 transition-colors">
                  <td className="px-4 py-3 font-semibold text-dark">{r.nama}</td>
                  <td className="px-4 py-3 font-mono text-xs">{r.tanggal}</td>
                  <td className="px-4 py-3 font-mono text-xs">{r.jam_masuk_str}</td>
                  <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded-full text-[0.68rem] font-bold ring-1 ring-inset ${r.menit_terlambat > 30 ? 'bg-red-50 text-red-700 ring-red-600/10' : 'bg-orange-50 text-orange-700 ring-orange-600/10'}`}>{r.menit_terlambat} mnt</span></td>
                  <td className="px-4 py-3 font-mono text-xs">{r.durasi_jam !== null ? `${r.durasi_jam} jam` : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div></div>
      )}
    </div>
  )
}

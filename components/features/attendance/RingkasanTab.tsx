import { MetricCard } from '@/components/ui'
import { attendanceService } from '@/services/attendance.service'

interface RingkasanTabProps {
  rekap: ReturnType<typeof attendanceService.calculateRekap>
}

export function RingkasanTab({ rekap }: RingkasanTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Karyawan" value={rekap.length} icon="👥" />
        <MetricCard label="Avg Hadir" value={`${rekap.length ? Math.round(rekap.reduce((s, r) => s + r.pct_kehadiran, 0) / rekap.length) : 0}%`} icon="📈" />
        <MetricCard label="Terlambat" value={rekap.reduce((s, r) => s + r.terlambat, 0)} icon="⚠️" />
        <MetricCard label="Total Mnt" value={rekap.reduce((s, r) => s + r.total_mnt_telat, 0)} icon="⏱️" />
      </div>
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-surface">
              <th className="px-4 py-3 text-left text-[0.68rem] font-semibold text-muted uppercase tracking-wider">Nama</th>
              <th className="px-4 py-3 text-left text-[0.68rem] font-semibold text-muted uppercase tracking-wider">Dept</th>
              <th className="px-4 py-3 text-left text-[0.68rem] font-semibold text-muted uppercase tracking-wider">Hadir</th>
              <th className="px-4 py-3 text-left text-[0.68rem] font-semibold text-muted uppercase tracking-wider">Absen</th>
              <th className="px-4 py-3 text-left text-[0.68rem] font-semibold text-muted uppercase tracking-wider">%</th>
              <th className="px-4 py-3 text-left text-[0.68rem] font-semibold text-muted uppercase tracking-wider">Telat</th>
              <th className="px-4 py-3 text-left text-[0.68rem] font-semibold text-muted uppercase tracking-wider">Mnt</th>
              <th className="px-4 py-3 text-left text-[0.68rem] font-semibold text-muted uppercase tracking-wider">Tap1x</th>
              <th className="px-4 py-3 text-left text-[0.68rem] font-semibold text-muted uppercase tracking-wider">Avg</th>
            </tr></thead>
            <tbody className="divide-y divide-border/50">
              {rekap.map((r, i) => (
                <tr key={i} className="hover:bg-surface/60 transition-colors">
                  <td className="px-4 py-3 font-semibold text-dark">{r.nama}</td>
                  <td className="px-4 py-3 text-muted text-xs">{r.departemen}</td>
                  <td className="px-4 py-3 font-mono text-xs">{r.hari_hadir}</td>
                  <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded-full text-[0.68rem] font-semibold ring-1 ring-inset ${r.tidak_hadir > 0 ? 'bg-red-50 text-red-700 ring-red-600/10' : 'bg-emerald-50 text-emerald-700 ring-emerald-600/10'}`}>{r.tidak_hadir}</span></td>
                  <td className="px-4 py-3 font-mono text-xs">{r.pct_kehadiran}%</td>
                  <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded-full text-[0.68rem] font-semibold ring-1 ring-inset ${r.terlambat > 0 ? 'bg-orange-50 text-orange-700 ring-orange-600/10' : 'bg-emerald-50 text-emerald-700 ring-emerald-600/10'}`}>{r.terlambat}</span></td>
                  <td className={`px-4 py-3 font-mono text-xs ${r.total_mnt_telat > 0 ? 'text-err font-bold' : ''}`}>{r.total_mnt_telat}</td>
                  <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded-full text-[0.68rem] font-semibold ring-1 ring-inset ${r.tap_1x > 0 ? 'bg-amber-50 text-amber-700 ring-amber-600/10' : 'bg-gray-50 text-gray-500 ring-gray-400/10'}`}>{r.tap_1x}</span></td>
                  <td className="px-4 py-3 font-mono text-xs">{r.avg_jam || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

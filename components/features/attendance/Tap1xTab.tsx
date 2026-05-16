import { MetricCard, EmptyState, StatusBadge } from '@/components/ui'
import type { Absensi, AbsensiStatus } from '@/types/attendance.types'
import { ABSENSI_STATUS_BADGE } from '@/types/attendance.types'

interface Tap1xTabProps {
  data: Omit<Absensi, 'id' | 'created_at'>[]
  tap1Data: Omit<Absensi, 'id' | 'created_at'>[]
}

export function Tap1xTab({ data, tap1Data }: Tap1xTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 text-amber-800 text-sm border border-amber-100">🟡 <strong>Tap 1x</strong> = hanya tap sekali. Tetap <strong>hadir</strong>, perlu tindak lanjut.</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard label="Total Kejadian" value={tap1Data.length} icon="🟡" />
        <MetricCard label="Karyawan" value={new Set(tap1Data.map(r => r.nama)).size} icon="👥" />
        <MetricCard label="% dari Total" value={`${data.length ? Math.round(tap1Data.length / data.length * 100) : 0}%`} icon="📊" />
      </div>
      {tap1Data.length === 0 ? <EmptyState icon="🎉" message="Tidak ada data tap 1x!" /> : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden"><div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-surface">
              <th className="px-4 py-3 text-left text-[0.68rem] font-semibold text-muted uppercase tracking-wider">Nama</th>
              <th className="px-4 py-3 text-left text-[0.68rem] font-semibold text-muted uppercase tracking-wider">Dept</th>
              <th className="px-4 py-3 text-left text-[0.68rem] font-semibold text-muted uppercase tracking-wider">Tanggal</th>
              <th className="px-4 py-3 text-left text-[0.68rem] font-semibold text-muted uppercase tracking-wider">Waktu</th>
              <th className="px-4 py-3 text-left text-[0.68rem] font-semibold text-muted uppercase tracking-wider">Status</th>
            </tr></thead>
            <tbody className="divide-y divide-border/50">
              {[...tap1Data].sort((a, b) => a.nama.localeCompare(b.nama)).map((r, i) => (
                <tr key={i} className="hover:bg-surface/60 transition-colors">
                  <td className="px-4 py-3 font-semibold text-dark">{r.nama}</td>
                  <td className="px-4 py-3 text-muted text-xs">{r.departemen}</td>
                  <td className="px-4 py-3 font-mono text-xs">{r.tanggal}</td>
                  <td className="px-4 py-3 font-mono text-xs">{r.jam_masuk_str}</td>
                  <td className="px-4 py-3"><StatusBadge label={r.status} config={ABSENSI_STATUS_BADGE[r.status as AbsensiStatus]} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div></div>
      )}
    </div>
  )
}

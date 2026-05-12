interface MetricCardProps {
  label: string
  value: string | number
  icon: string
  sub?: string
  trend?: 'up' | 'down' | 'neutral'
}

export function MetricCard({ label, value, icon, sub, trend }: MetricCardProps) {
  return (
    <div className="group bg-card border border-border rounded-2xl p-5 hover:shadow-md hover:border-brand/20 transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[0.7rem] font-semibold text-muted uppercase tracking-wider">{label}</span>
        <span className="text-lg opacity-60 group-hover:opacity-100 transition-opacity">{icon}</span>
      </div>
      <div className="text-2xl font-extrabold text-dark tracking-tight leading-none">{value}</div>
      {sub && <div className="text-xs text-muted mt-1.5">{sub}</div>}
      {trend && (
        <div className={`text-xs font-semibold mt-1.5 ${trend === 'up' ? 'text-ok' : trend === 'down' ? 'text-err' : 'text-muted'}`}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '—'} {sub}
        </div>
      )}
    </div>
  )
}

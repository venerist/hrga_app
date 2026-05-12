// Reusable MetricCard component
// Replaces the repeated metric-card pattern found in ALL 6 dashboard pages

interface MetricCardProps {
  label: string
  value: string | number
  icon: string
  /** Optional sub-text below the value */
  sub?: string
}

export function MetricCard({ label, value, icon, sub }: MetricCardProps) {
  return (
    <div className="metric-card">
      <div className="metric-label">{icon} {label}</div>
      <div className="metric-value">{value}</div>
      {sub && <div className="metric-sub">{sub}</div>}
    </div>
  )
}

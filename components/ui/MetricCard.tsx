import React from 'react'

interface MetricCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  sub?: string
  trend?: 'up' | 'down' | 'neutral'
  color?: 'primary' | 'secondary' | 'accent' | 'warn' | 'success'
}

const colorMaps = {
  primary:   'bg-indigo-50 text-indigo-600',
  secondary: 'bg-emerald-50 text-emerald-600',
  accent:    'bg-purple-50 text-purple-600',
  warn:      'bg-amber-50 text-amber-600',
  success:   'bg-teal-50 text-teal-600'
}

export function MetricCard({ label, value, icon, sub, trend, color = 'primary' }: MetricCardProps) {
  const colorClass = colorMaps[color] || colorMaps.primary

  return (
    <div className="group bg-card border border-border rounded-2xl p-5 hover:shadow-md hover:border-brand/20 transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[0.7rem] font-bold text-muted uppercase tracking-wider">{label}</span>
        <div className={`w-8 h-8 rounded-lg ${colorClass} flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity`}>
          {icon}
        </div>
      </div>
      <div className="text-2xl font-extrabold text-dark tracking-tight leading-none">{value}</div>
      {sub && <div className="text-xs text-muted mt-1.5">{sub}</div>}
      {trend && (
        <div className={`text-xs font-bold mt-1.5 flex items-center gap-1 ${trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-600' : 'text-muted'}`}>
          <span>{trend === 'up' ? '↑' : trend === 'down' ? '↓' : '—'}</span>
          <span>{sub}</span>
        </div>
      )}
    </div>
  )
}

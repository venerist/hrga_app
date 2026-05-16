import React from 'react'

interface PageHeaderProps {
  title: string
  subtitle: string
  icon?: React.ReactNode
  gradient?: 'brand' | 'cyan' | 'emerald' | 'amber' | 'purple'
  action?: React.ReactNode
}

const gradients = {
  brand: 'from-brand-dark via-brand to-orange-400',
  cyan: 'from-cyan-600 via-cyan-500 to-blue-400',
  emerald: 'from-emerald-600 via-emerald-500 to-teal-400',
  amber: 'from-amber-600 via-amber-500 to-orange-400',
  purple: 'from-purple-600 via-purple-500 to-pink-400'
}

export function PageHeader({ title, subtitle, icon, gradient = 'brand', action }: PageHeaderProps) {
  const gradClass = gradients[gradient] || gradients.brand

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradClass} p-6 mb-6 shadow-lg shadow-brand/10`}>
      {/* Decorative circles */}
      <div className="absolute -top-8 -right-6 w-32 h-32 rounded-full bg-white/[0.08]" />
      <div className="absolute -bottom-10 -left-8 w-24 h-24 rounded-full bg-white/[0.05]" />
      <div className="relative flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            {icon && <span className="flex items-center justify-center">{icon}</span>}
            {title}
          </h1>
          <p className="text-sm text-white/85 mt-1 font-medium">{subtitle}</p>
        </div>
        {action && <div className="relative z-10">{action}</div>}
      </div>
    </div>
  )
}

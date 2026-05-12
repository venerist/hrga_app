interface PageHeaderProps {
  title: string
  subtitle: string
  icon?: string
  action?: React.ReactNode
}

export function PageHeader({ title, subtitle, icon, action }: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-dark via-brand to-orange-400 p-6 mb-6">
      {/* Decorative circles */}
      <div className="absolute -top-8 -right-6 w-32 h-32 rounded-full bg-white/[0.06]" />
      <div className="absolute -bottom-10 -left-8 w-24 h-24 rounded-full bg-white/[0.04]" />
      <div className="relative flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            {icon && <span className="text-2xl">{icon}</span>}
            {title}
          </h1>
          <p className="text-sm text-white/75 mt-1">{subtitle}</p>
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  )
}

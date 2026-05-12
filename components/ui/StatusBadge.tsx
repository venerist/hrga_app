import type { BadgeConfig } from '@/types/common.types'

interface StatusBadgeProps {
  label: string
  config: BadgeConfig
}

const badgeStyles: Record<string, string> = {
  'badge-green':  'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
  'badge-red':    'bg-red-50 text-red-700 ring-red-600/10',
  'badge-yellow': 'bg-amber-50 text-amber-700 ring-amber-600/10',
  'badge-orange': 'bg-orange-50 text-orange-700 ring-orange-600/10',
  'badge-blue':   'bg-blue-50 text-blue-700 ring-blue-600/10',
  'badge-gray':   'bg-gray-100 text-gray-600 ring-gray-500/10',
}

export function StatusBadge({ label, config }: StatusBadgeProps) {
  const cls = badgeStyles[config.className] || badgeStyles['badge-gray']
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[0.7rem] font-semibold ring-1 ring-inset ${cls}`}>
      {config.emoji && <span>{config.emoji}</span>}
      {label}
    </span>
  )
}

export function SimpleBadge({ label, variant, bold }: { label: string | number; variant: string; bold?: boolean }) {
  const cls = badgeStyles[variant] || badgeStyles['badge-gray']
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.7rem] ring-1 ring-inset ${cls} ${bold ? 'font-bold' : 'font-semibold'}`}>
      {label}
    </span>
  )
}

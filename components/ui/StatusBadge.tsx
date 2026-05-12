// Reusable StatusBadge component
// Replaces the 4+ duplicated statusBadge/jenisBadge functions across pages

import type { BadgeConfig } from '@/types/common.types'

interface StatusBadgeProps {
  /** The status text to display */
  label: string
  /** Badge configuration with className and optional emoji */
  config: BadgeConfig
}

/**
 * Generic badge component that renders any status/type with consistent styling.
 *
 * Usage:
 * ```tsx
 * import { REKRUTMEN_STATUS_BADGE } from '@/types/recruitment.types'
 * <StatusBadge label={row.status} config={REKRUTMEN_STATUS_BADGE[row.status]} />
 * ```
 */
export function StatusBadge({ label, config }: StatusBadgeProps) {
  return (
    <span className={`badge ${config.className}`}>
      {config.emoji ? `${config.emoji} ` : ''}{label}
    </span>
  )
}

/**
 * Simple badge with just a variant class and label.
 * For cases where you don't have a config object.
 */
export function SimpleBadge({
  label,
  variant,
  bold = false,
}: {
  label: string | number
  variant: string
  bold?: boolean
}) {
  return (
    <span className={`badge ${variant}`} style={bold ? { fontWeight: 800 } : undefined}>
      {label}
    </span>
  )
}

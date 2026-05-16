// Common types used across the HRGA application

export interface BaseEntity {
  id: string
  created_at: string
}

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface ApiResponse<T> {
  data: T | null
  error: string | null
  count?: number
}

// Badge variant types used across multiple modules
export type BadgeVariant =
  | 'badge-green'
  | 'badge-red'
  | 'badge-yellow'
  | 'badge-orange'
  | 'badge-blue'
  | 'badge-gray'
  | 'badge-amber'
  | 'badge-cyan'
  | 'badge-slate'
  | 'badge-pink'
  | 'badge-black'

export interface BadgeConfig {
  className: BadgeVariant
  emoji?: string
}

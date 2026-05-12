// User and authentication types

import type { BaseEntity } from './common.types'

export type UserRole = 'admin' | 'hr_manager' | 'hr_staff' | 'viewer'

export interface User extends BaseEntity {
  email: string
  full_name: string
  role: UserRole
  is_active: boolean
  last_login: string | null
}

export interface AuthSession {
  user: User
  token: string
  expires_at: string
}

/** Which navigation items each role can access */
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin:      ['dashboard', 'payroll', 'rekrutmen', 'cuti', 'kpi', 'ga', 'settings'],
  hr_manager: ['dashboard', 'payroll', 'rekrutmen', 'cuti', 'kpi', 'ga'],
  hr_staff:   ['dashboard', 'cuti', 'kpi'],
  viewer:     ['dashboard'],
}

/** Human-readable role labels */
export const ROLE_LABELS: Record<UserRole, string> = {
  admin:      'Administrator',
  hr_manager: 'HR Manager',
  hr_staff:   'HR Staff',
  viewer:     'Viewer',
}

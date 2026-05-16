import { UserRole } from './auth.types'

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: ['dashboard', 'attendance', 'payroll', 'analytics', 'rekrutmen', 'cuti', 'kpi', 'ga', 'settings'],
  hr_manager: ['dashboard', 'attendance', 'payroll', 'analytics', 'rekrutmen', 'cuti', 'kpi', 'ga'],
  hr_staff: ['dashboard', 'attendance', 'cuti', 'kpi'],
  manager: ['dashboard', 'analytics', 'attendance', 'cuti', 'kpi'],
  employee: ['dashboard', 'attendance', 'payroll', 'cuti'],
  viewer: ['dashboard'],
}

/**
 * Checks if a role has access to a specific path.
 */
export function canAccessRoute(role: UserRole, path: string): boolean {
  if (path === '/' || path.startsWith('/login')) return true
  
  const parts = path.split('/').filter(Boolean)
  const module = parts[0] === 'dashboard' ? parts[1] || 'dashboard' : parts[0]
  
  return ROLE_PERMISSIONS[role]?.includes(module) ?? false
}

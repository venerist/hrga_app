import { UserRole } from './auth.types'

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: ['dashboard', 'payroll', 'rekrutmen', 'cuti', 'kpi', 'ga', 'settings'],
  hr_manager: ['dashboard', 'payroll', 'rekrutmen', 'cuti', 'kpi', 'ga'],
  hr_staff: ['dashboard', 'cuti', 'kpi'],
  manager: ['dashboard', 'cuti', 'kpi'],
  employee: ['dashboard', 'cuti'],
  viewer: ['dashboard'],
}

/**
 * Checks if a role has access to a specific path.
 */
export function canAccessRoute(role: UserRole, path: string): boolean {
  if (path === '/' || path.startsWith('/login')) return true
  
  // Example path: /dashboard/payroll
  const parts = path.split('/').filter(Boolean)
  if (parts[0] !== 'dashboard') return true // Allow other non-dashboard routes if any
  
  const module = parts[1] || 'dashboard' // if just /dashboard, module is 'dashboard'
  
  return ROLE_PERMISSIONS[role]?.includes(module) ?? false
}

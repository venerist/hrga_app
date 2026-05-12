import type { BaseEntity } from '@/types/common.types'

export type UserRole = 'admin' | 'hr_manager' | 'hr_staff' | 'manager' | 'employee' | 'viewer'

export interface AuthUser extends BaseEntity {
  email: string
  full_name: string
  role: UserRole
  is_active: boolean
  last_login: string | null
}

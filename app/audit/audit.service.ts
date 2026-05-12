import { createAdminClient } from '@/lib/supabase/server'

export interface AuditLogInsert {
  user_id?: string
  user_email?: string
  action: string
  table_name: string
  record_id?: string
  old_data?: any
  new_data?: any
  ip_address?: string
}

export const auditService = {
  /**
   * Log an action to the audit_logs table.
   * This should run on the server (e.g. in a Server Action or API Route).
   */
  async logAction(log: AuditLogInsert) {
    const supabase = await createAdminClient()
    const { error } = await supabase.from('audit_logs').insert([log])
    if (error) {
      console.error('Failed to write audit log:', error)
    }
  }
}

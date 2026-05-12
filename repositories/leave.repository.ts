// Leave (Cuti) repository — all Supabase interactions for the cuti table

import { supabase } from '@/lib/supabase'
import type { Cuti, CutiInsert, CutiStatus } from '@/types/leave.types'

export const leaveRepository = {
  /**
   * Fetch all leave records, newest first.
   */
  async getAll(): Promise<Cuti[]> {
    const { data, error } = await supabase
      .from('cuti')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data as Cuti[]) || []
  },

  /**
   * Get the total count of leave records.
   */
  async getCount(): Promise<number> {
    const { count, error } = await supabase
      .from('cuti')
      .select('*', { count: 'exact', head: true })

    if (error) throw error
    return count || 0
  },

  /**
   * Create a new leave request.
   */
  async create(record: CutiInsert): Promise<void> {
    const { error } = await supabase.from('cuti').insert(record)
    if (error) throw error
  },

  /**
   * Update the status of a leave request.
   */
  async updateStatus(id: string, status: CutiStatus): Promise<void> {
    const { error } = await supabase
      .from('cuti')
      .update({ status })
      .eq('id', id)

    if (error) throw error
  },

  /**
   * Delete a leave record by ID.
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('cuti')
      .delete()
      .eq('id', id)

    if (error) throw error
  },
}

// General Affairs repository — all Supabase interactions for the ga table

import { supabase } from '@/lib/supabase'
import type { Ga, GaInsert, GaStatus } from '@/types/ga.types'

export const gaRepository = {
  /**
   * Fetch all GA records, newest first.
   */
  async getAll(): Promise<Ga[]> {
    const { data, error } = await supabase
      .from('ga')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data as Ga[]) || []
  },

  /**
   * Get the total count of GA records.
   */
  async getCount(): Promise<number> {
    const { count, error } = await supabase
      .from('ga')
      .select('*', { count: 'exact', head: true })

    if (error) throw error
    return count || 0
  },

  /**
   * Create a new GA ticket.
   */
  async create(record: GaInsert): Promise<void> {
    const { error } = await supabase.from('ga').insert(record)
    if (error) throw error
  },

  /**
   * Update the status of a GA ticket.
   */
  async updateStatus(id: string, status: GaStatus): Promise<void> {
    const { error } = await supabase
      .from('ga')
      .update({ status })
      .eq('id', id)

    if (error) throw error
  },

  /**
   * Delete a GA record by ID.
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('ga')
      .delete()
      .eq('id', id)

    if (error) throw error
  },
}

// Recruitment repository — all Supabase interactions for the rekrutmen table

import { supabase } from '@/lib/supabase'
import type { Rekrutmen, RekrutmenInsert, RekrutmenStatus } from '@/types/recruitment.types'

export const recruitmentRepository = {
  /**
   * Fetch all recruitment records, newest first.
   */
  async getAll(): Promise<Rekrutmen[]> {
    const { data, error } = await supabase
      .from('rekrutmen')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data as Rekrutmen[]) || []
  },

  /**
   * Get the total count of recruitment records.
   */
  async getCount(): Promise<number> {
    const { count, error } = await supabase
      .from('rekrutmen')
      .select('*', { count: 'exact', head: true })

    if (error) throw error
    return count || 0
  },

  /**
   * Create a new recruitment record.
   */
  async create(record: RekrutmenInsert): Promise<void> {
    const { error } = await supabase.from('rekrutmen').insert(record)
    if (error) throw error
  },

  /**
   * Update the status of a recruitment record.
   */
  async updateStatus(id: string, status: RekrutmenStatus): Promise<void> {
    const { error } = await supabase
      .from('rekrutmen')
      .update({ status })
      .eq('id', id)

    if (error) throw error
  },

  /**
   * Delete a recruitment record by ID.
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('rekrutmen')
      .delete()
      .eq('id', id)

    if (error) throw error
  },
}

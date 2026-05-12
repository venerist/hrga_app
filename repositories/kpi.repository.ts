// KPI repository — all Supabase interactions for the kpi table

import { supabase } from '@/lib/supabase'
import type { Kpi, KpiInsert } from '@/types/kpi.types'

export const kpiRepository = {
  /**
   * Fetch all KPI records, newest first.
   */
  async getAll(): Promise<Kpi[]> {
    const { data, error } = await supabase
      .from('kpi')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data as Kpi[]) || []
  },

  /**
   * Get the total count of KPI records.
   */
  async getCount(): Promise<number> {
    const { count, error } = await supabase
      .from('kpi')
      .select('*', { count: 'exact', head: true })

    if (error) throw error
    return count || 0
  },

  /**
   * Create a new KPI record.
   */
  async create(record: KpiInsert): Promise<void> {
    const { error } = await supabase.from('kpi').insert(record)
    if (error) throw error
  },

  /**
   * Delete a KPI record by ID.
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('kpi')
      .delete()
      .eq('id', id)

    if (error) throw error
  },
}

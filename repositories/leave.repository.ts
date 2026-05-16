// Leave (Cuti) repository — all Supabase interactions for leave requests and leave types

import { supabase } from '@/lib/supabase'
import type { Cuti, CutiInsert, CutiStatus } from '@/types/leave.types'

export const leaveRepository = {
  async getAll(): Promise<Cuti[]> {
    const { data, error } = await supabase
      .from('cuti')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data as Cuti[]) || []
  },

  async getById(id: string): Promise<Cuti | null> {
    const { data, error } = await supabase
      .from('cuti')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return data as Cuti
  },

  async getCount(): Promise<number> {
    const { count, error } = await supabase
      .from('cuti')
      .select('*', { count: 'exact', head: true })

    if (error) throw error
    return count || 0
  },

  async create(record: CutiInsert): Promise<void> {
    const { error } = await supabase.from('cuti').insert(record)
    if (error) throw error
  },

  async updateStatus(id: string, status: CutiStatus): Promise<void> {
    const { error } = await supabase
      .from('cuti')
      .update({ status })
      .eq('id', id)

    if (error) throw error
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('cuti')
      .delete()
      .eq('id', id)

    if (error) throw error
  },
}

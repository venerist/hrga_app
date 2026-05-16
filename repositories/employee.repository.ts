import { supabase } from '@/lib/supabase'
import type { Employee } from '@/types/employee.types'

export const employeeRepository = {
  async getAll(): Promise<Employee[]> {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error
    return (data as Employee[]) || []
  },

  async getByNik(nik: string): Promise<Employee | null> {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('nik', nik)
      .single()

    if (error) throw error
    return data as Employee | null
  },

  async upsert(employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'>): Promise<void> {
    const { error } = await supabase
      .from('employees')
      .upsert(employee, { onConflict: 'nik' })

    if (error) throw error
  },
}

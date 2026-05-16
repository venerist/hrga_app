import { supabase } from '@/lib/supabase'
import type { PayrollDetail, PayrollPeriod, PayrollSetting } from '@/types/payroll.types'

export const payrollRepository = {
  async getPeriods(): Promise<PayrollPeriod[]> {
    const { data, error } = await supabase
      .from('payroll_periods')
      .select('*')
      .order('year', { ascending: false })
      .order('month', { ascending: false })

    if (error) throw error
    return (data as PayrollPeriod[]) || []
  },

  async getPeriodById(id: string): Promise<PayrollPeriod | null> {
    const { data, error } = await supabase
      .from('payroll_periods')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as PayrollPeriod | null
  },

  async createPeriod(period: Omit<PayrollPeriod, 'id' | 'created_at'>): Promise<PayrollPeriod> {
    const { data, error } = await supabase
      .from('payroll_periods')
      .insert(period)
      .select('*')
      .single()

    if (error) throw error
    return data as PayrollPeriod
  },

  async updatePeriodStatus(id: string, status: PayrollPeriod['status']): Promise<void> {
    const { error } = await supabase
      .from('payroll_periods')
      .update({ status })
      .eq('id', id)

    if (error) throw error
  },

  async createDetails(details: Omit<PayrollDetail, 'id' | 'created_at'>[]): Promise<void> {
    if (details.length === 0) return
    const { error } = await supabase
      .from('payroll_details')
      .insert(details)

    if (error) throw error
  },

  async getDetailsByPeriod(period_id: string): Promise<PayrollDetail[]> {
    const { data, error } = await supabase
      .from('payroll_details')
      .select('*')
      .eq('period_id', period_id)
      .order('employee_nik', { ascending: true })

    if (error) throw error
    return (data as PayrollDetail[]) || []
  },

  async getSettings(): Promise<PayrollSetting[]> {
    const { data, error } = await supabase
      .from('payroll_settings')
      .select('*')

    if (error) throw error
    return (data as PayrollSetting[]) || []
  },
}

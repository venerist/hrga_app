import { supabase } from '@/lib/supabase'
import type { NationalHoliday } from '@/types/attendance.types'

export const nationalHolidayRepository = {
  async getByYear(year: number): Promise<NationalHoliday[]> {
    const start = `${year}-01-01`
    const end = `${year}-12-31`

    const { data, error } = await supabase
      .from('national_holidays')
      .select('*')
      .gte('holiday_date', start)
      .lte('holiday_date', end)
      .order('holiday_date', { ascending: true })

    if (error) throw error
    return (data as NationalHoliday[]) || []
  },

  async bulkUpsert(holidays: Omit<NationalHoliday, 'id' | 'created_at'>[]): Promise<void> {
    if (holidays.length === 0) return

    const { error } = await supabase
      .from('national_holidays')
      .upsert(holidays, { onConflict: 'holiday_date' })

    if (error) throw error
  },

  async deleteByDate(date: string): Promise<void> {
    const { error } = await supabase
      .from('national_holidays')
      .delete()
      .eq('holiday_date', date)

    if (error) throw error
  }
}

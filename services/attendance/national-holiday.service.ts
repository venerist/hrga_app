import { nationalHolidayRepository } from '@/repositories/national-holiday.repository'
import type { NationalHoliday } from '@/types/attendance.types'

export const nationalHolidayService = {
  async fetchAndCacheHolidays(year: number): Promise<NationalHoliday[]> {
    try {
      // 1. Check cache in DB
      const holidays = await nationalHolidayRepository.getByYear(year)
      if (holidays.length > 0) {
        return holidays
      }

      // 2. Fetch from external API
      // Using a reliable Indonesian holiday API
      const response = await fetch(`https://api-harilibur.vercel.app/get?year=${year}`)
      if (!response.ok) throw new Error('Failed to fetch holidays from API')
      
      const data = await response.json()
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid holiday data format')
      }

      const nationalHolidays: Omit<NationalHoliday, 'id' | 'created_at'>[] = data
        .filter((h: any) => h.is_holiday)
        .map((h: any) => ({
          holiday_date: h.holiday_date,
          name: h.holiday_name,
          is_official: true
        }))

      // 3. Save to DB
      await nationalHolidayRepository.bulkUpsert(nationalHolidays)

      // 4. Return from DB to get IDs
      return await nationalHolidayRepository.getByYear(year)
    } catch (error) {
      console.error('Error in nationalHolidayService:', error)
      // Return cached even if empty to allow fallback
      return await nationalHolidayRepository.getByYear(year)
    }
  },

  async getHolidays(year: number): Promise<NationalHoliday[]> {
    return this.fetchAndCacheHolidays(year)
  }
}

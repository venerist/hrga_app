// Attendance repository — all Supabase interactions for the absensi table

import { supabase } from '@/lib/supabase'
import type { Absensi } from '@/types/attendance.types'

export const attendanceRepository = {
  /**
   * Fetch all attendance records, optionally filtered by periode.
   * Sorted by date descending.
   */
  async getAll(periode?: string): Promise<Absensi[]> {
    let query = supabase
      .from('absensi')
      .select('*')
      .order('tanggal', { ascending: false })

    if (periode) {
      query = query.eq('periode', periode)
    }

    const { data, error } = await query
    if (error) throw error
    return (data as Absensi[]) || []
  },

  /**
   * Fetch attendance summary columns for dashboard.
   */
  async getDashboardData(): Promise<Pick<Absensi, 'nama' | 'tanggal' | 'status' | 'menit_terlambat' | 'departemen'>[]> {
    const { data, error } = await supabase
      .from('absensi')
      .select('nama,tanggal,status,menit_terlambat,departemen')
      .order('tanggal', { ascending: false })

    if (error) throw error
    return data || []
  },

  /**
   * Bulk insert processed attendance records.
   * Deletes existing data for the same periode first to avoid duplicates.
   */
  async bulkUpsert(records: Omit<Absensi, 'id' | 'created_at'>[], periode: string): Promise<void> {
    // Remove existing records for this period
    const { error: deleteError } = await supabase
      .from('absensi')
      .delete()
      .eq('periode', periode)

    if (deleteError) throw deleteError

    // Insert new records
    const { error: insertError } = await supabase
      .from('absensi')
      .insert(records)

    if (insertError) throw insertError
  },
}

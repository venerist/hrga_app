import { format, parse, isSunday, isSaturday, getDay } from 'date-fns'
import type { AbsensiStatus } from '@/types/attendance.types'

export const ATTENDANCE_CONFIG = {
  WORK_START: '08:00',
  WORK_END: '16:00',
  WORK_DAYS: [1, 2, 3, 4, 5, 6], // Mon-Sat
}

export function isWorkDay(date: Date, holidays: string[]): boolean {
  const dateStr = format(date, 'yyyy-MM-dd')
  if (holidays.includes(dateStr)) return false
  
  const day = getDay(date)
  return ATTENDANCE_CONFIG.WORK_DAYS.includes(day)
}

export function calculateStatus(
  scans: string[],
  isWorkDay: boolean
): {
  status: AbsensiStatus
  lateMinutes: number
  overtimeMinutes: number
} {
  if (scans.length === 0) {
    return {
      status: isWorkDay ? 'Absent' : 'Present', // If not work day, status is 'Present' or 'Holiday' but user said "Tidak hadir jika tidak ada scan pada hari kerja"
      lateMinutes: 0,
      overtimeMinutes: 0
    }
  }

  // Sort scans
  const sortedScans = [...scans].sort()
  const firstScan = sortedScans[0]
  const lastScan = sortedScans[sortedScans.length - 1]

  const firstScanTime = firstScan.split(' ')[1]
  const lastScanTime = lastScan.split(' ')[1]

  let status: AbsensiStatus = 'Present'
  let lateMinutes = 0
  let overtimeMinutes = 0

  // Late calculation
  const [startHour, startMin] = ATTENDANCE_CONFIG.WORK_START.split(':').map(Number)
  const [scanHour, scanMin] = firstScanTime.split(':').map(Number)
  
  const startTotal = startHour * 60 + startMin
  const scanTotal = scanHour * 60 + scanMin

  if (scanTotal > startTotal) {
    lateMinutes = scanTotal - startTotal
    status = 'Terlambat'
  }

  // Overtime calculation
  const [endHour, endMin] = ATTENDANCE_CONFIG.WORK_END.split(':').map(Number)
  const [lastHour, lastMin] = lastScanTime.split(':').map(Number)

  const endTotal = endHour * 60 + endMin
  const lastTotal = lastHour * 60 + lastMin

  if (lastTotal > endTotal) {
    overtimeMinutes = lastTotal - endTotal
  }

  return { status, lateMinutes, overtimeMinutes }
}

import AttendanceImport from '@/components/features/attendance/AttendanceImport'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Import Attendance | Veneris HR',
  description: 'Import data fingerprint dan kelola absensi karyawan',
}

export default function AttendanceImportPage() {
  return <AttendanceImport />
}

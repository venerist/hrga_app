import { attendanceRepository } from '@/repositories/attendance.repository'
import { employeeRepository } from '@/repositories/employee.repository'
import { payrollRepository } from '@/repositories/payroll.repository'
import type { PayrollDetail, PayrollPeriod } from '@/types/payroll.types'

function formatMoney(value: number) {
  return Math.round(value * 100) / 100
}

export const payrollService = {
  async createPeriod(month: number, year: number): Promise<PayrollPeriod> {
    return payrollRepository.createPeriod({ month, year, status: 'Open' })
  },

  async calculatePayroll(
    periodId: string,
    month: number,
    year: number,
    baseSalaries: Record<string, number> = {}
  ): Promise<PayrollDetail[]> {
    const summaries = await attendanceRepository.getSummaryByMonthYear(month, year)
    const employees = await employeeRepository.getAll()
    const employeeMap = Object.fromEntries(employees.map(emp => [emp.nik, emp]))

    const grouped: Record<string, { absentDays: number; lateMinutes: number; overtimeMinutes: number }> = {}
    const daysInMonth = new Set(summaries.map(r => r.attendance_date)).size

    for (const summary of summaries) {
      const key = summary.employee_nik
      grouped[key] = grouped[key] || { absentDays: 0, lateMinutes: 0, overtimeMinutes: 0 }

      if (summary.status === 'Absent') grouped[key].absentDays++
      if (summary.late_minutes) grouped[key].lateMinutes += summary.late_minutes
      if (summary.overtime_minutes) grouped[key].overtimeMinutes += summary.overtime_minutes
    }

    const details: PayrollDetail[] = []

    for (const [employee_nik, totals] of Object.entries(grouped)) {
      const baseSalary = baseSalaries[employee_nik] ?? 0
      const attendanceDeduction = formatMoney(totals.absentDays * 150000 + totals.lateMinutes * 1000)
      const overtimePay = formatMoney(totals.overtimeMinutes * 15000)
      const bpjs = formatMoney(baseSalary * 0.037)
      const taxPph21 = formatMoney(baseSalary * 0.05)
      const netSalary = formatMoney(baseSalary - attendanceDeduction + overtimePay - bpjs - taxPph21)

      details.push({
        id: '',
        period_id: periodId,
        employee_nik,
        base_salary: baseSalary,
        attendance_deduction: attendanceDeduction,
        overtime_pay: overtimePay,
        bpjs,
        tax_pph21: taxPph21,
        net_salary: netSalary,
        created_at: new Date().toISOString(),
      })
    }

    return details
  },

  async savePayrollDetails(details: Omit<PayrollDetail, 'id' | 'created_at'>[]): Promise<void> {
    await payrollRepository.createDetails(details)
  },
}

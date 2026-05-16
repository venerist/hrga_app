'use client'
import { useEffect, useState } from 'react'
import { PageHeader, MetricCard, EmptyState } from '@/components/ui'
import { payrollService } from '@/services/payroll.service'
import { payrollRepository } from '@/repositories/payroll.repository'
import type { PayrollDetail, PayrollPeriod } from '@/types/payroll.types'

const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

export default function PayrollPage() {
  const [periods, setPeriods] = useState<PayrollPeriod[]>([])
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>('')
  const [details, setDetails] = useState<PayrollDetail[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadPeriods()
  }, [])

  useEffect(() => {
    if (selectedPeriodId) loadDetails(selectedPeriodId)
  }, [selectedPeriodId])

  async function loadPeriods() {
    setLoading(true)
    try {
      const rows = await payrollRepository.getPeriods()
      setPeriods(rows)
      if (rows.length && !selectedPeriodId) setSelectedPeriodId(rows[0].id)
    } catch (error: any) {
      setMessage(error.message || 'Gagal memuat periode payroll')
    } finally {
      setLoading(false)
    }
  }

  async function loadDetails(periodId: string) {
    setLoading(true)
    try {
      const rows = await payrollRepository.getDetailsByPeriod(periodId)
      setDetails(rows)
      setMessage('')
    } catch (error: any) {
      setMessage(error.message || 'Gagal memuat detail payroll')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreatePeriod() {
    setLoading(true)
    try {
      const now = new Date()
      const period = await payrollService.createPeriod(now.getMonth() + 1, now.getFullYear())
      setPeriods(prev => [period, ...prev])
      setSelectedPeriodId(period.id)
      setMessage('Periode payroll baru berhasil dibuat.')
    } catch (error: any) {
      setMessage(error.message || 'Gagal membuat periode payroll')
    } finally {
      setLoading(false)
    }
  }

  async function handleGeneratePayroll() {
    if (!selectedPeriodId) {
      setMessage('Pilih periode payroll terlebih dahulu.')
      return
    }

    const selectedPeriod = periods.find(p => p.id === selectedPeriodId)
    if (!selectedPeriod) {
      setMessage('Periode payroll tidak ditemukan.')
      return
    }

    setLoading(true)
    try {
      const generated = await payrollService.calculatePayroll(selectedPeriodId, selectedPeriod.month, selectedPeriod.year)
      await payrollService.savePayrollDetails(generated)
      setDetails(generated)
      setMessage('Payroll berhasil diproses berdasarkan attendance_summary.')
    } catch (error: any) {
      setMessage(error.message || 'Gagal menghitung payroll')
    } finally {
      setLoading(false)
    }
  }

  async function handleApprovePayroll() {
    if (!selectedPeriodId) return
    const selectedPeriod = periods.find(p => p.id === selectedPeriodId)
    if (!selectedPeriod) return

    setLoading(true)
    try {
      await payrollRepository.updatePeriodStatus(selectedPeriodId, 'Approved')
      setPeriods(prev => prev.map(p => p.id === selectedPeriodId ? { ...p, status: 'Approved' } : p))
      setMessage('Periode payroll disetujui.')
    } catch (error: any) {
      setMessage(error.message || 'Gagal menyetujui payroll')
    } finally {
      setLoading(false)
    }
  }

  const selectedPeriod = periods.find(p => p.id === selectedPeriodId)
  const totalNet = details.reduce((sum, item) => sum + item.net_salary, 0)

  return (
    <div className="space-y-6">
      <PageHeader icon="💰" title="Payroll Automation" subtitle="Atur periode, proses payroll, dan review payslip berbasis attendance_summary." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <MetricCard label="Periode Payroll" value={periods.length.toString()} icon="🗓️" />
        <MetricCard label="Detail Tersedia" value={details.length.toString()} icon="📄" />
        <MetricCard label="Estimasi Net" value={currencyFormatter.format(totalNet)} icon="💵" />
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-dark">Payroll Period</h3>
            <p className="text-sm text-muted mt-1">Kelola periode dan persiapkan proses penggajian.</p>
          </div>
          <button onClick={handleCreatePeriod} disabled={loading} className="btn-primary w-full md:w-auto">
            {loading ? 'Memproses...' : 'Buat Periode Baru'}
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-dark mb-1.5">Pilih Periode</label>
            <select value={selectedPeriodId} onChange={e => setSelectedPeriodId(e.target.value)} className="input-base w-full">
              <option value="">Pilih periode</option>
              {periods.map(period => (
                <option key={period.id} value={period.id}>{`Bulan ${period.month} ${period.year} — ${period.status}`}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={handleGeneratePayroll} disabled={loading || !selectedPeriodId} className="btn-secondary w-full">
              Generate Payroll
            </button>
            <button onClick={handleApprovePayroll} disabled={loading || !selectedPeriodId || selectedPeriod?.status === 'Approved'} className="btn-accent w-full">
              Setujui
            </button>
          </div>
        </div>
      </div>

      {message && <div className="rounded-2xl border border-border bg-surface p-4 text-sm text-muted">{message}</div>}

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-surface/50 flex items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-dark">Payroll Details</h3>
          <span className="text-xs text-muted">Sumber: attendance_summary (read-only)</span>
        </div>
        {details.length === 0 ? (
          <div className="p-6"><EmptyState icon="📭" message="Tidak ada detail payroll untuk periode ini." /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-surface">
                <th className="px-4 py-3 text-left text-[0.68rem] font-semibold text-muted uppercase tracking-wider">NIK</th>
                <th className="px-4 py-3 text-left text-[0.68rem] font-semibold text-muted uppercase tracking-wider">Gaji Pokok</th>
                <th className="px-4 py-3 text-left text-[0.68rem] font-semibold text-muted uppercase tracking-wider">Potongan</th>
                <th className="px-4 py-3 text-left text-[0.68rem] font-semibold text-muted uppercase tracking-wider">Overtime</th>
                <th className="px-4 py-3 text-left text-[0.68rem] font-semibold text-muted uppercase tracking-wider">Net Salary</th>
              </tr></thead>
              <tbody className="divide-y divide-border/50">
                {details.map(detail => (
                  <tr key={detail.employee_nik} className="hover:bg-surface/60 transition-colors">
                    <td className="px-4 py-3 font-semibold text-dark">{detail.employee_nik}</td>
                    <td className="px-4 py-3">{currencyFormatter.format(detail.base_salary)}</td>
                    <td className="px-4 py-3">{currencyFormatter.format(detail.attendance_deduction)}</td>
                    <td className="px-4 py-3">{currencyFormatter.format(detail.overtime_pay)}</td>
                    <td className="px-4 py-3 font-semibold">{currencyFormatter.format(detail.net_salary)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

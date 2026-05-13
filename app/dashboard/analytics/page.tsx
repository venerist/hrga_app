'use client'
import { PageHeader, MetricCard } from '@/components/ui'
import { BarChart3, TrendingUp, Users, Clock, Download, Calendar } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, LineChart, Line, Legend } from 'recharts'

const attendanceTrend = [
  { month: 'Jan', hadir: 94, telat: 6, absen: 2 },
  { month: 'Feb', hadir: 96, telat: 5, absen: 1 },
  { month: 'Mar', hadir: 93, telat: 8, absen: 3 },
  { month: 'Apr', hadir: 97, telat: 4, absen: 1 },
  { month: 'Mei', hadir: 95, telat: 6, absen: 2 },
  { month: 'Jun', hadir: 96, telat: 5, absen: 1 },
]

const productivityData = [
  { subject: 'Kehadiran', A: 95, fullMark: 100 },
  { subject: 'Tepat Waktu', A: 88, fullMark: 100 },
  { subject: 'KPI Score', A: 82, fullMark: 100 },
  { subject: 'Produktivitas', A: 90, fullMark: 100 },
  { subject: 'Engagement', A: 85, fullMark: 100 },
  { subject: 'Retention', A: 92, fullMark: 100 },
]

const departmentComparison = [
  { dept: 'Engineering', kehadiran: 96, kpi: 88, retention: 94 },
  { dept: 'Marketing', kehadiran: 93, kpi: 82, retention: 88 },
  { dept: 'Finance', kehadiran: 98, kpi: 91, retention: 96 },
  { dept: 'HR', kehadiran: 97, kpi: 85, retention: 92 },
  { dept: 'Operations', kehadiran: 94, kpi: 79, retention: 85 },
]

const payrollTrend = [
  { month: 'Jan', total: 850, overtime: 45 },
  { month: 'Feb', total: 860, overtime: 52 },
  { month: 'Mar', total: 875, overtime: 38 },
  { month: 'Apr', total: 890, overtime: 60 },
  { month: 'Mei', total: 920, overtime: 55 },
]

const tooltipStyle = { background: 'rgba(15,23,42,0.9)', border: 'none', borderRadius: '12px', fontSize: '12px', color: '#E2E8F0' }

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        icon={<BarChart3 size={24} />}
        title="Analytics & Insights"
        subtitle="Advanced HR analytics — workforce intelligence & operational metrics"
        gradient="cyan"
        action={
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm font-semibold backdrop-blur transition-all cursor-pointer">
            <Download size={15} /> Export Report
          </button>
        }
      />

      {/* KPI Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Avg Kehadiran" value="95.2%" icon={<Users size={20} />} color="primary" trend={{ value: 2.1, label: 'vs Q1' }} />
        <MetricCard label="On-time Rate" value="88.7%" icon={<Clock size={20} />} color="secondary" trend={{ value: -1.3, label: 'vs Q1' }} />
        <MetricCard label="KPI Score" value="84.5" icon={<TrendingUp size={20} />} color="accent" trend={{ value: 5.2, label: 'vs Q1' }} />
        <MetricCard label="Retention Rate" value="92.1%" icon={<Users size={20} />} color="primary" trend={{ value: 3.0, label: 'vs Q1' }} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Attendance Trend */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-dark">Attendance Trend</h3>
              <p className="text-xs text-muted mt-0.5">% kehadiran, keterlambatan & absensi bulanan</p>
            </div>
            <div className="flex items-center gap-3 text-[0.65rem]">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" /> Hadir</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-warn" /> Telat</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-err" /> Absen</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={attendanceTrend}>
              <defs>
                <linearGradient id="gradHadir" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="hadir" stroke="#4F46E5" fill="url(#gradHadir)" strokeWidth={2} />
              <Area type="monotone" dataKey="telat" stroke="#F59E0B" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
              <Area type="monotone" dataKey="absen" stroke="#EF4444" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Productivity Radar */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-sm font-bold text-dark mb-1">Workforce Productivity Index</h3>
          <p className="text-xs text-muted mb-4">Skor performa organisasi (skala 100)</p>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={productivityData}>
              <PolarGrid stroke="rgba(148,163,184,0.2)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <PolarRadiusAxis tick={{ fontSize: 9, fill: '#94A3B8' }} domain={[0, 100]} />
              <Radar name="Score" dataKey="A" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Department Comparison */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-sm font-bold text-dark mb-1">Department Comparison</h3>
          <p className="text-xs text-muted mb-4">Perbandingan performa antar departemen</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={departmentComparison} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
              <XAxis dataKey="dept" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="kehadiran" fill="#4F46E5" radius={[4, 4, 0, 0]} name="Kehadiran" />
              <Bar dataKey="kpi" fill="#10B981" radius={[4, 4, 0, 0]} name="KPI" />
              <Bar dataKey="retention" fill="#06B6D4" radius={[4, 4, 0, 0]} name="Retention" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payroll Trend */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-sm font-bold text-dark mb-1">Payroll Cost Trend</h3>
          <p className="text-xs text-muted mb-4">Total biaya payroll & overtime (juta Rp)</p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={payrollTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Line type="monotone" dataKey="total" stroke="#4F46E5" strokeWidth={2.5} dot={{ r: 4, fill: '#4F46E5' }} name="Total Payroll" />
              <Line type="monotone" dataKey="overtime" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3, fill: '#F59E0B' }} name="Overtime" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* HR Operational Insights */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-sm font-bold text-dark mb-4">HR Operational Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InsightCard
            title="Turnover Risk"
            value="Low"
            desc="3 karyawan teridentifikasi berisiko resign berdasarkan pola ketidakhadiran"
            color="secondary"
          />
          <InsightCard
            title="Overtime Alert"
            value="Medium"
            desc="Departemen Engineering melebihi rata-rata overtime 20% dari target bulanan"
            color="warn"
          />
          <InsightCard
            title="Recruitment Gap"
            value="5 posisi"
            desc="Terdapat 5 posisi open lebih dari 30 hari tanpa kandidat shortlisted"
            color="primary"
          />
        </div>
      </div>
    </div>
  )
}

function InsightCard({ title, value, desc, color }: { title: string; value: string; desc: string; color: string }) {
  const colors: Record<string, string> = {
    primary: 'border-primary/20 bg-primary-50/50',
    secondary: 'border-secondary/20 bg-secondary-50/50',
    warn: 'border-amber-500/20 bg-amber-50/50',
  }
  const valueBg: Record<string, string> = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    warn: 'bg-amber-500/10 text-amber-600',
  }
  return (
    <div className={`rounded-xl p-4 border ${colors[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-dark">{title}</h4>
        <span className={`px-2 py-0.5 rounded-full text-[0.65rem] font-bold ${valueBg[color]}`}>{value}</span>
      </div>
      <p className="text-xs text-muted leading-relaxed">{desc}</p>
    </div>
  )
}

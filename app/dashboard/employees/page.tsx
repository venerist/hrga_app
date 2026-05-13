'use client'
import { useState } from 'react'
import { PageHeader, MetricCard, EmptyState } from '@/components/ui'
import { Users, Search, Plus, MoreHorizontal, Mail, Phone, MapPin, Building, Calendar, X } from 'lucide-react'

// Demo employee data
const employees = [
  { id: '1', name: 'Budi Santoso', email: 'budi@company.com', dept: 'Engineering', position: 'Senior Developer', status: 'Active', joinDate: '2023-01-15', avatar: 'BS' },
  { id: '2', name: 'Siti Rahmawati', email: 'siti@company.com', dept: 'Marketing', position: 'Marketing Manager', status: 'Active', joinDate: '2022-06-20', avatar: 'SR' },
  { id: '3', name: 'Ahmad Fauzi', email: 'ahmad@company.com', dept: 'Finance', position: 'Financial Analyst', status: 'Active', joinDate: '2024-02-10', avatar: 'AF' },
  { id: '4', name: 'Dewi Lestari', email: 'dewi@company.com', dept: 'HR', position: 'HR Specialist', status: 'Active', joinDate: '2023-08-05', avatar: 'DL' },
  { id: '5', name: 'Rudi Hartono', email: 'rudi@company.com', dept: 'Operations', position: 'Operations Lead', status: 'On Leave', joinDate: '2021-03-12', avatar: 'RH' },
  { id: '6', name: 'Maya Putri', email: 'maya@company.com', dept: 'Engineering', position: 'Frontend Developer', status: 'Active', joinDate: '2024-01-08', avatar: 'MP' },
  { id: '7', name: 'Hendri Wijaya', email: 'hendri@company.com', dept: 'Engineering', position: 'Backend Developer', status: 'Active', joinDate: '2023-05-22', avatar: 'HW' },
  { id: '8', name: 'Lisa Permata', email: 'lisa@company.com', dept: 'Marketing', position: 'Content Writer', status: 'Probation', joinDate: '2024-04-01', avatar: 'LP' },
]

const deptColors: Record<string, string> = {
  Engineering: 'bg-primary/10 text-primary',
  Marketing: 'bg-secondary/10 text-secondary',
  Finance: 'bg-accent/10 text-accent',
  HR: 'bg-amber-500/10 text-amber-600',
  Operations: 'bg-purple-500/10 text-purple-600',
}

const statusColors: Record<string, string> = {
  Active: 'bg-secondary/10 text-secondary',
  'On Leave': 'bg-amber-500/10 text-amber-600',
  Probation: 'bg-primary/10 text-primary',
  Inactive: 'bg-red-500/10 text-red-500',
}

const avatarColors = ['from-primary to-primary-dark', 'from-secondary to-secondary-dark', 'from-accent to-accent-dark', 'from-purple-500 to-purple-700', 'from-amber-500 to-amber-700']

export default function EmployeesPage() {
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('Semua')
  const [selectedEmployee, setSelectedEmployee] = useState<typeof employees[0] | null>(null)
  const [view, setView] = useState<'grid' | 'table'>('grid')

  const departments = ['Semua', ...Array.from(new Set(employees.map(e => e.dept)))]
  const filtered = employees
    .filter(e => deptFilter === 'Semua' || e.dept === deptFilter)
    .filter(e => search === '' || e.name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase()))

  const stats = {
    total: employees.length,
    active: employees.filter(e => e.status === 'Active').length,
    onLeave: employees.filter(e => e.status === 'On Leave').length,
    probation: employees.filter(e => e.status === 'Probation').length,
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        icon={<Users size={24} />}
        title="Manajemen Karyawan"
        subtitle="Database karyawan, profil, dan organisasi"
        gradient="emerald"
        action={
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm font-semibold backdrop-blur transition-all cursor-pointer">
            <Plus size={15} /> Tambah Karyawan
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Karyawan" value={stats.total} icon={<Users size={20} />} color="primary" />
        <MetricCard label="Active" value={stats.active} icon="✅" color="secondary" />
        <MetricCard label="On Leave" value={stats.onLeave} icon="🏖️" color="warn" />
        <MetricCard label="Probation" value={stats.probation} icon="📋" color="accent" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            className="input-base !pl-10 !text-sm"
            placeholder="Cari karyawan..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            className="input-base !w-auto !py-2 !text-sm"
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
          >
            {departments.map(d => <option key={d}>{d}</option>)}
          </select>
          <div className="flex rounded-xl border border-border overflow-hidden">
            <button onClick={() => setView('grid')} className={`px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${view === 'grid' ? 'bg-primary text-white' : 'bg-card text-muted hover:text-dark'}`}>Grid</button>
            <button onClick={() => setView('table')} className={`px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${view === 'table' ? 'bg-primary text-white' : 'bg-card text-muted hover:text-dark'}`}>Table</button>
          </div>
        </div>
      </div>

      {/* Employee Grid */}
      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((emp, i) => (
            <div
              key={emp.id}
              onClick={() => setSelectedEmployee(emp)}
              className="glass-card rounded-2xl p-5 cursor-pointer group animate-fade-in-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white text-sm font-bold shadow-lg`}>
                  {emp.avatar}
                </div>
                <button className="p-1.5 rounded-lg text-muted hover:text-dark hover:bg-surface-alt transition-colors cursor-pointer opacity-0 group-hover:opacity-100">
                  <MoreHorizontal size={16} />
                </button>
              </div>
              <h3 className="text-sm font-bold text-dark">{emp.name}</h3>
              <p className="text-xs text-muted mt-0.5">{emp.position}</p>
              <div className="flex items-center gap-2 mt-3">
                <span className={`px-2 py-0.5 rounded-full text-[0.6rem] font-semibold ${deptColors[emp.dept]}`}>{emp.dept}</span>
                <span className={`px-2 py-0.5 rounded-full text-[0.6rem] font-semibold ${statusColors[emp.status]}`}>{emp.status}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-alt/50">
                  <th className="px-4 py-3 text-left text-[0.68rem] font-semibold text-muted uppercase tracking-wider">Karyawan</th>
                  <th className="px-4 py-3 text-left text-[0.68rem] font-semibold text-muted uppercase tracking-wider">Posisi</th>
                  <th className="px-4 py-3 text-left text-[0.68rem] font-semibold text-muted uppercase tracking-wider">Departemen</th>
                  <th className="px-4 py-3 text-left text-[0.68rem] font-semibold text-muted uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-[0.68rem] font-semibold text-muted uppercase tracking-wider">Bergabung</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filtered.map((emp, i) => (
                  <tr key={emp.id} className="hover:bg-surface-alt/60 transition-colors cursor-pointer" onClick={() => setSelectedEmployee(emp)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white text-xs font-bold`}>{emp.avatar}</div>
                        <div>
                          <div className="font-semibold text-dark">{emp.name}</div>
                          <div className="text-[0.65rem] text-muted">{emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-dark">{emp.position}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-[0.65rem] font-semibold ${deptColors[emp.dept]}`}>{emp.dept}</span></td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-[0.65rem] font-semibold ${statusColors[emp.status]}`}>{emp.status}</span></td>
                    <td className="px-4 py-3 font-mono text-xs text-muted">{emp.joinDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setSelectedEmployee(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg animate-scale-in">
            <div className="glass-card rounded-2xl p-6 shadow-elevated mx-4">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-lg font-bold shadow-lg">
                    {selectedEmployee.avatar}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-dark">{selectedEmployee.name}</h2>
                    <p className="text-sm text-muted">{selectedEmployee.position}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedEmployee(null)} className="p-1.5 rounded-lg text-muted hover:text-dark hover:bg-surface-alt transition-colors cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <DetailRow icon={<Mail size={14} />} label="Email" value={selectedEmployee.email} />
                <DetailRow icon={<Building size={14} />} label="Departemen" value={selectedEmployee.dept} />
                <DetailRow icon={<Calendar size={14} />} label="Bergabung" value={selectedEmployee.joinDate} />
                <DetailRow icon={<Users size={14} />} label="Status" value={selectedEmployee.status} />
              </div>

              <div className="flex gap-3 mt-6">
                <button className="btn-primary flex-1 !py-2.5 text-sm !rounded-xl">Edit Profil</button>
                <button className="btn-secondary flex-1 !py-2.5 text-sm !rounded-xl">Lihat Kontrak</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-alt/50">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">{icon}</div>
      <div>
        <p className="text-[0.65rem] text-muted uppercase tracking-wider font-medium">{label}</p>
        <p className="text-sm font-semibold text-dark">{value}</p>
      </div>
    </div>
  )
}

'use client'
import { useState, useEffect } from 'react'
import { PageHeader, MetricCard, EmptyState, LoadingSpinner } from '@/components/ui'
import { Users, Search, Plus, MoreHorizontal, Mail, Phone, MapPin, Building, Calendar, X, Save } from 'lucide-react'
import { spreadsheetService, type SheetEmployee } from '@/services/spreadsheet.service'

const avatarColors = ['from-primary to-primary-dark', 'from-secondary to-secondary-dark', 'from-accent to-accent-dark', 'from-purple-500 to-purple-700', 'from-amber-500 to-amber-700']

interface EmployeeDisplay {
  id: string
  name: string
  email: string
  dept: string
  position: string
  status: string
  joinDate: string
  avatar: string
  color: string
}

function generateAvatarAndColor(name: string, id: string) {
  const safeName = (name || 'Employee').trim()
  const safeId = (id || '000').toString()

  const parts = safeName.split(/\s+/)
  let initials = 'EM'
  if (parts.length >= 2) {
    initials = (parts[0][0] + parts[1][0]).toUpperCase()
  } else if (parts.length === 1 && parts[0].length >= 2) {
    initials = parts[0].substring(0, 2).toUpperCase()
  } else if (parts.length === 1 && parts[0].length === 1) {
    initials = parts[0].toUpperCase()
  }

  // Deterministic color based on ID
  const hash = safeId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const color = avatarColors[hash % avatarColors.length]

  return { initials, color }
}

function mapSheetToEmployee(sheet: SheetEmployee): EmployeeDisplay {
  const emailName = sheet.nama.toLowerCase().replace(/[^a-z0-9]/g, '')
  const { initials, color } = generateAvatarAndColor(sheet.nama, sheet.nik)

  return {
    id: sheet.nik,
    name: sheet.nama,
    email: `${emailName}@company.com`,
    dept: sheet.divisi || 'General',
    position: sheet.jabatan || 'Staff',
    status: 'Active',
    joinDate: '2023-01-01',
    avatar: initials,
    color
  }
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<EmployeeDisplay[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('Semua')
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeDisplay | null>(null)
  const [view, setView] = useState<'grid' | 'table'>('grid')

  // Add Employee Modal State
  const [showAddModal, setShowAddModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [addForm, setAddForm] = useState({ nik: '', nama: '', divisi: '', jabatan: '' })

  const fetchCurrentEmployees = async () => {
    try {
      const freshData = await spreadsheetService.fetchEmployees()
      setEmployees(freshData.map(mapSheetToEmployee))
    } catch (err) {
      console.error('Failed to load fresh employee data', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const cached = spreadsheetService.getCachedEmployees()
    if (cached) {
      setEmployees(cached.map(mapSheetToEmployee))
      setLoading(false)
    }
    fetchCurrentEmployees()
  }, [])

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!addForm.nik || !addForm.nama || !addForm.divisi || !addForm.jabatan) {
      alert('Semua field wajib diisi!')
      return
    }
    
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm)
      })
      
      if (!res.ok) {
        throw new Error('Gagal menyimpan ke Google Spreadsheet')
      }

      const resData = await res.json()

      // Optimistically update local cache and state so it appears immediately
      const newSheetEmp: SheetEmployee = {
        nik: addForm.nik,
        nama: addForm.nama,
        divisi: addForm.divisi,
        jabatan: addForm.jabatan,
        status: 'Active'
      }
      
      const cached = spreadsheetService.getCachedEmployees() || []
      const updatedCache = [...cached, newSheetEmp]
      localStorage.setItem('veneris_employees_cache', JSON.stringify(updatedCache))
      
      setEmployees(updatedCache.map(mapSheetToEmployee))
      
      setShowAddModal(false)
      setAddForm({ nik: '', nama: '', divisi: '', jabatan: '' })
      
      if (resData.simulated) {
        alert('Data berhasil ditambahkan secara lokal (Simulasi API Sheets).')
      } else {
        alert('Berhasil menambah karyawan!')
      }
    } catch (error: any) {
      alert(error.message || 'Terjadi kesalahan saat menyimpan data.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const departments = ['Semua', ...Array.from(new Set(employees.map(e => e.dept)))]
  const filtered = employees
    .filter(e => deptFilter === 'Semua' || e.dept === deptFilter)
    .filter(e => search === '' || e.name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase()))

  const stats = {
    total: employees.length,
    active: employees.filter(e => e.status === 'Active').length,
    onLeave: employees.filter(e => e.status === 'On Leave').length,
    probation: employees.filter(e => e.status === 'Probation').length,
  }

  const getDeptColor = (dept: string) => {
    const defaultColors = ['bg-primary/10 text-primary', 'bg-secondary/10 text-secondary', 'bg-accent/10 text-accent', 'bg-purple-500/10 text-purple-600', 'bg-amber-500/10 text-amber-600']
    const hash = dept.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return defaultColors[hash % defaultColors.length]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-secondary/10 text-secondary'
      case 'On Leave': return 'bg-amber-500/10 text-amber-600'
      case 'Probation': return 'bg-primary/10 text-primary'
      default: return 'bg-red-500/10 text-red-500'
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        icon={<Users size={24} />}
        title="Manajemen Karyawan"
        subtitle="Database karyawan, profil, dan organisasi (Live dari Spreadsheet)"
        gradient="emerald"
        action={
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm font-semibold backdrop-blur transition-all cursor-pointer">
            <Plus size={15} /> Tambah Karyawan
          </button>
        }
      />

      {loading && employees.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <>
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
                placeholder="Cari karyawan, NIK..."
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

          {employees.length === 0 ? (
            <EmptyState icon={<Users size={40} className="opacity-50" />} message="Tidak ada data karyawan dari spreadsheet." />
          ) : view === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((emp, i) => (
                <div
                  key={emp.id}
                  onClick={() => setSelectedEmployee(emp)}
                  className="glass-card rounded-2xl p-5 cursor-pointer group animate-fade-in-up"
                  style={{ animationDelay: `${(i % 10) * 0.05}s` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${emp.color} flex items-center justify-center text-white text-sm font-bold shadow-lg`}>
                      {emp.avatar}
                    </div>
                    <button className="p-1.5 rounded-lg text-muted hover:text-dark hover:bg-surface-alt transition-colors cursor-pointer opacity-0 group-hover:opacity-100">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                  <h3 className="text-sm font-bold text-dark">{emp.name}</h3>
                  <p className="text-xs text-muted mt-0.5">{emp.position}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className={`px-2 py-0.5 rounded-full text-[0.6rem] font-semibold ${getDeptColor(emp.dept)}`}>{emp.dept}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[0.6rem] font-semibold ${getStatusColor(emp.status)}`}>{emp.status}</span>
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
                      <th className="px-4 py-3 text-left text-[0.68rem] font-semibold text-muted uppercase tracking-wider">NIK</th>
                      <th className="px-4 py-3 text-left text-[0.68rem] font-semibold text-muted uppercase tracking-wider">Posisi</th>
                      <th className="px-4 py-3 text-left text-[0.68rem] font-semibold text-muted uppercase tracking-wider">Departemen</th>
                      <th className="px-4 py-3 text-left text-[0.68rem] font-semibold text-muted uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {filtered.map((emp) => (
                      <tr key={emp.id} className="hover:bg-surface-alt/60 transition-colors cursor-pointer" onClick={() => setSelectedEmployee(emp)}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${emp.color} flex items-center justify-center text-white text-xs font-bold`}>{emp.avatar}</div>
                            <div>
                              <div className="font-semibold text-dark">{emp.name}</div>
                              <div className="text-[0.65rem] text-muted">{emp.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-muted">{emp.id}</td>
                        <td className="px-4 py-3 text-dark">{emp.position}</td>
                        <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-[0.65rem] font-semibold ${getDeptColor(emp.dept)}`}>{emp.dept}</span></td>
                        <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-[0.65rem] font-semibold ${getStatusColor(emp.status)}`}>{emp.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Add Employee Modal */}
          {showAddModal && (
            <>
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]" onClick={() => !isSubmitting && setShowAddModal(false)} />
              <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-full max-w-md animate-scale-in">
                <form onSubmit={handleAddSubmit} className="glass-card rounded-2xl p-6 shadow-elevated mx-4 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-bold text-dark flex items-center gap-2"><Plus size={20} className="text-primary" /> Tambah Karyawan Baru</h2>
                    <button type="button" onClick={() => !isSubmitting && setShowAddModal(false)} className="p-1.5 rounded-lg text-muted hover:text-dark hover:bg-surface-alt transition-colors cursor-pointer">
                      <X size={18} />
                    </button>
                  </div>
                  
                  <p className="text-xs text-muted mb-4">Data ini akan otomatis ditambahkan ke Google Spreadsheet utama.</p>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-dark mb-1.5">NIK Karyawan *</label>
                      <input required className="w-full px-3.5 py-2.5 rounded-xl border-[1.5px] border-border bg-white text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all" placeholder="Contoh: 10123" value={addForm.nik} onChange={e => setAddForm({ ...addForm, nik: e.target.value })} disabled={isSubmitting} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-dark mb-1.5">Nama Lengkap *</label>
                      <input required className="w-full px-3.5 py-2.5 rounded-xl border-[1.5px] border-border bg-white text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all" placeholder="John Doe" value={addForm.nama} onChange={e => setAddForm({ ...addForm, nama: e.target.value })} disabled={isSubmitting} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-dark mb-1.5">Divisi / Departemen *</label>
                      <input required className="w-full px-3.5 py-2.5 rounded-xl border-[1.5px] border-border bg-white text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all" placeholder="Engineering" value={addForm.divisi} onChange={e => setAddForm({ ...addForm, divisi: e.target.value })} disabled={isSubmitting} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-dark mb-1.5">Jabatan / Posisi *</label>
                      <input required className="w-full px-3.5 py-2.5 rounded-xl border-[1.5px] border-border bg-white text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all" placeholder="Senior Developer" value={addForm.jabatan} onChange={e => setAddForm({ ...addForm, jabatan: e.target.value })} disabled={isSubmitting} />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand text-white text-sm font-bold hover:bg-brand-dark transition-all disabled:opacity-60 cursor-pointer shadow-md shadow-brand/15">
                      {isSubmitting ? <span className="spinner" /> : <><Save size={16} /> Simpan Karyawan</>}
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}

          {/* Employee Detail Modal */}
          {selectedEmployee && (
            <>
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]" onClick={() => setSelectedEmployee(null)} />
              <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-full max-w-lg animate-scale-in">
                <div className="glass-card rounded-2xl p-6 shadow-elevated mx-4">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${selectedEmployee.color} flex items-center justify-center text-white text-lg font-bold shadow-lg`}>
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
                    <DetailRow icon={<Phone size={14} />} label="NIK" value={selectedEmployee.id} />
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

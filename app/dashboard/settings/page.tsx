'use client'
import { PageHeader } from '@/components/ui'
import { Shield, Check, X, Users, ChevronRight } from 'lucide-react'

const roles = ['Admin', 'HR Manager', 'HR Staff', 'Manager', 'Employee', 'Viewer'] as const
const modules = ['Dashboard', 'Payroll', 'Rekrutmen', 'Cuti & Izin', 'KPI', 'General Affairs', 'Analytics', 'Employees', 'Settings']

const permissionMatrix: Record<string, boolean[]> = {
  'Admin':       [true, true, true, true, true, true, true, true, true],
  'HR Manager':  [true, true, true, true, true, true, true, true, false],
  'HR Staff':    [true, false, false, true, true, false, false, true, false],
  'Manager':     [true, false, false, true, true, false, true, false, false],
  'Employee':    [true, false, false, true, false, false, false, false, false],
  'Viewer':      [true, false, false, false, false, false, false, false, false],
}

const roleColors: Record<string, string> = {
  Admin: 'from-primary to-primary-dark',
  'HR Manager': 'from-secondary to-secondary-dark',
  'HR Staff': 'from-accent to-accent-dark',
  Manager: 'from-purple-500 to-purple-700',
  Employee: 'from-amber-500 to-amber-700',
  Viewer: 'from-gray-400 to-gray-600',
}

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        icon={<Shield size={24} />}
        title="Pengaturan & RBAC"
        subtitle="Role-Based Access Control — permission matrix & system settings"
        gradient="indigo"
      />

      {/* Role Hierarchy */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-sm font-bold text-dark mb-1">Role Hierarchy</h3>
        <p className="text-xs text-muted mb-6">Hierarki akses berdasarkan role pengguna</p>
        <div className="flex flex-wrap gap-3">
          {roles.map((role, i) => (
            <div key={role} className="flex items-center gap-2">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${roleColors[role]} flex items-center justify-center text-white text-xs font-bold shadow-md`}>
                {role[0]}
              </div>
              <div>
                <p className="text-xs font-semibold text-dark">{role}</p>
                <p className="text-[0.6rem] text-muted">{modules.filter((_, mi) => permissionMatrix[role][mi]).length} modules</p>
              </div>
              {i < roles.length - 1 && <ChevronRight size={14} className="text-border mx-1" />}
            </div>
          ))}
        </div>
      </div>

      {/* Permission Matrix */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          <Shield size={16} className="text-primary" />
          <div>
            <h3 className="text-sm font-bold text-dark">Permission Matrix</h3>
            <p className="text-[0.65rem] text-muted">Akses modul berdasarkan role pengguna</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-alt/50">
                <th className="px-4 py-3 text-left text-[0.68rem] font-semibold text-muted uppercase tracking-wider sticky left-0 bg-surface-alt/50 z-10">Modul</th>
                {roles.map(role => (
                  <th key={role} className="px-4 py-3 text-center text-[0.68rem] font-semibold text-muted uppercase tracking-wider whitespace-nowrap">{role}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {modules.map((mod, mi) => (
                <tr key={mod} className="hover:bg-surface-alt/60 transition-colors">
                  <td className="px-4 py-3 font-semibold text-dark text-xs sticky left-0 bg-card z-10">{mod}</td>
                  {roles.map(role => (
                    <td key={role} className="px-4 py-3 text-center">
                      {permissionMatrix[role][mi] ? (
                        <span className="inline-flex w-6 h-6 rounded-lg bg-secondary/10 items-center justify-center">
                          <Check size={14} className="text-secondary" />
                        </span>
                      ) : (
                        <span className="inline-flex w-6 h-6 rounded-lg bg-red-50 items-center justify-center">
                          <X size={14} className="text-red-300" />
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Architecture Summary */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-sm font-bold text-dark mb-4">System Security Architecture</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ArchCard title="Authentication" items={['Supabase SSR Auth', 'HTTP-only Cookies', 'Session Refresh', 'Legacy Fallback']} color="primary" />
          <ArchCard title="Authorization" items={['Middleware RBAC', 'Route Protection', 'Role Hierarchy', 'Permission Matrix']} color="secondary" />
          <ArchCard title="Data Security" items={['PostgreSQL RLS', 'Row-level Policies', 'Service Role Key', 'Audit Logging']} color="accent" />
        </div>
      </div>
    </div>
  )
}

function ArchCard({ title, items, color }: { title: string; items: string[]; color: string }) {
  const colors: Record<string, string> = {
    primary: 'border-primary/20 bg-primary-50/30',
    secondary: 'border-secondary/20 bg-secondary-50/30',
    accent: 'border-accent/20 bg-accent-50/30',
  }
  const dotColor: Record<string, string> = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    accent: 'bg-accent',
  }
  return (
    <div className={`rounded-xl p-4 border ${colors[color]}`}>
      <h4 className="text-xs font-bold text-dark mb-3">{title}</h4>
      <ul className="space-y-2">
        {items.map(item => (
          <li key={item} className="flex items-center gap-2 text-xs text-muted">
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor[color]} shrink-0`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

'use client'
import { useRouter, usePathname } from 'next/navigation'
import { AppLogo } from '@/components/ui'
import { LayoutDashboard, DollarSign, Target, CalendarDays, Star, Wrench, LogOut } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface NavItem {
  href: string
  icon: LucideIcon
  label: string
}

const NAV: NavItem[] = [
  { href: '/dashboard',           icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/payroll',   icon: DollarSign,      label: 'Payroll & Absensi' },
  { href: '/dashboard/rekrutmen', icon: Target,          label: 'Rekrutmen' },
  { href: '/dashboard/cuti',      icon: CalendarDays,    label: 'Cuti & Izin' },
  { href: '/dashboard/kpi',       icon: Star,            label: 'KPI' },
  { href: '/dashboard/ga',        icon: Wrench,          label: 'General Affairs' },
]

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()

  function logout() {
    sessionStorage.clear()
    router.push('/login')
  }

  return (
    <aside className="w-60 min-w-60 bg-sidebar fixed top-0 left-0 h-screen z-50 flex flex-col overflow-y-auto border-r border-white/[0.06]">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-white/[0.06]">
        <AppLogo variant="light" size="sm" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="px-3 mb-2 text-[0.65rem] font-semibold text-gray-500 uppercase tracking-widest">Menu</p>
        {NAV.map(item => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          const Icon = item.icon
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[0.82rem] font-medium transition-all duration-150
                ${active
                  ? 'bg-brand text-white shadow-lg shadow-brand/20'
                  : 'text-gray-400 hover:bg-white/[0.06] hover:text-gray-200'
                }`}
            >
              <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/[0.06]">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[0.82rem] font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
        >
          <LogOut size={18} strokeWidth={1.8} />
          Logout
        </button>
      </div>
    </aside>
  )
}

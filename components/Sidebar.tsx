'use client'
import { useRouter, usePathname } from 'next/navigation'

const NAV = [
  { href: '/dashboard',           icon: '🏠', label: 'Dashboard' },
  { href: '/dashboard/payroll',   icon: '💰', label: 'Payroll & Absensi' },
  { href: '/dashboard/rekrutmen', icon: '🎯', label: 'Rekrutmen' },
  { href: '/dashboard/cuti',      icon: '📅', label: 'Cuti & Izin' },
  { href: '/dashboard/kpi',       icon: '⭐', label: 'KPI' },
  { href: '/dashboard/ga',        icon: '🔧', label: 'General Affairs' },
]

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()

  function logout() {
    sessionStorage.clear()
    router.push('/login')
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-brand">🟠 HRGA System</div>
        <div className="sidebar-sub">Human Resource &amp; General Affairs</div>
      </div>

      <nav className="sidebar-nav">
        {NAV.map(item => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <button
              key={item.href}
              className={`nav-item ${active ? 'active' : ''}`}
              onClick={() => router.push(item.href)}
            >
              <span className="icon">{item.icon}</span>
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item" onClick={logout} style={{ color: '#ef4444' }}>
          <span className="icon">🚪</span>
          Logout
        </button>
      </div>
    </aside>
  )
}

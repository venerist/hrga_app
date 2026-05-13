'use client'
import { useState } from 'react'
import { ThemeToggle } from './ThemeToggle'
import { Bell, Search, ChevronDown, Menu } from 'lucide-react'

interface TopBarProps {
  onMenuToggle?: () => void
  showMenuButton?: boolean
}

export function TopBar({ onMenuToggle, showMenuButton = false }: TopBarProps) {
  const [searchFocused, setSearchFocused] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <header className="sticky top-0 z-40 glass border-b border-border/60 px-4 lg:px-6">
      <div className="flex items-center justify-between h-16">
        {/* Left: Menu toggle + Search */}
        <div className="flex items-center gap-3">
          {showMenuButton && (
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-xl hover:bg-surface-alt transition-colors lg:hidden cursor-pointer"
            >
              <Menu size={20} className="text-muted" />
            </button>
          )}

          <div className={`relative transition-all duration-300 ${searchFocused ? 'w-80' : 'w-64'} hidden md:block`}>
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search employees, modules..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-alt border border-transparent text-sm text-dark placeholder:text-muted-light outline-none transition-all focus:border-primary/30 focus:bg-card focus:shadow-sm"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[0.6rem] text-muted-light bg-card border border-border px-1.5 py-0.5 rounded font-mono">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl hover:bg-surface-alt transition-colors cursor-pointer focus-ring"
            >
              <Bell size={18} className="text-muted" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-err animate-pulse" />
            </button>

            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <div className="absolute right-0 top-12 w-80 glass-card rounded-2xl shadow-elevated z-50 overflow-hidden animate-scale-in">
                  <div className="p-4 border-b border-border">
                    <h3 className="text-sm font-bold text-dark">Notifikasi</h3>
                  </div>
                  <div className="p-4 space-y-3">
                    <NotificationItem
                      title="Pengajuan Cuti Baru"
                      desc="Andi Prasetyo — Cuti Tahunan (3 hari)"
                      time="5 menit lalu"
                      unread
                    />
                    <NotificationItem
                      title="KPI Deadline"
                      desc="Penilaian KPI Q2 berakhir dalam 3 hari"
                      time="1 jam lalu"
                    />
                    <NotificationItem
                      title="Kandidat Baru"
                      desc="2 kandidat baru masuk pipeline rekrutmen"
                      time="2 jam lalu"
                    />
                  </div>
                  <div className="p-3 border-t border-border text-center">
                    <button className="text-xs text-primary font-semibold hover:text-primary-dark transition-colors cursor-pointer">
                      Lihat semua notifikasi
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-border mx-1 hidden sm:block" />

          {/* User */}
          <button className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-surface-alt transition-colors cursor-pointer focus-ring">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-xs font-bold">
              A
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-dark leading-tight">Admin</div>
              <div className="text-[0.6rem] text-muted leading-tight">Administrator</div>
            </div>
            <ChevronDown size={14} className="text-muted hidden sm:block" />
          </button>
        </div>
      </div>
    </header>
  )
}

function NotificationItem({ title, desc, time, unread }: { title: string; desc: string; time: string; unread?: boolean }) {
  return (
    <div className={`p-3 rounded-xl transition-colors cursor-pointer ${unread ? 'bg-primary-50/50 dark:bg-primary/5' : 'hover:bg-surface-alt'}`}>
      <div className="flex items-start gap-2">
        {unread && <span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />}
        <div className={!unread ? 'pl-4' : ''}>
          <p className="text-xs font-semibold text-dark">{title}</p>
          <p className="text-[0.7rem] text-muted mt-0.5">{desc}</p>
          <p className="text-[0.6rem] text-muted-light mt-1">{time}</p>
        </div>
      </div>
    </div>
  )
}

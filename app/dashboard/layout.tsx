'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [ok, setOk] = useState(false)

  useEffect(() => {
    const loggedIn = sessionStorage.getItem('hrga_logged_in')
    if (loggedIn !== 'true') router.replace('/login')
    else setOk(true)
  }, [router])

  if (!ok) return null

  return (
    <div className="layout">
      <Sidebar />
      <main className="main">{children}</main>
    </div>
  )
}

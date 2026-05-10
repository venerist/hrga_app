'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    const loggedIn = sessionStorage.getItem('hrga_logged_in')
    if (loggedIn === 'true') router.push('/dashboard')
    else router.push('/login')
  }, [router])
  return null
}

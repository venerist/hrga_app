'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppLogo } from '@/components/ui'
import { Lock } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setTimeout(() => {
      if (username === process.env.NEXT_PUBLIC_ADMIN_USERNAME && password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
        sessionStorage.setItem('hrga_logged_in', 'true')
        sessionStorage.setItem('hrga_user', username)
        router.push('/dashboard')
      } else {
        setError('Username atau password salah.')
        setLoading(false)
      }
    }, 400)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-sidebar relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-brand/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-brand/10 rounded-full blur-3xl" />

      <div className="relative bg-card rounded-3xl p-8 w-full max-w-sm shadow-2xl shadow-black/30 border border-white/[0.06]">
        <div className="flex flex-col items-center mb-8">
          <AppLogo size="lg" variant="dark" />
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-sm font-medium mb-4 border border-red-100">
            <span>❌</span> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-dark mb-1.5">Username</label>
            <input
              className="w-full px-3.5 py-2.5 rounded-xl border-[1.5px] border-border bg-white text-sm font-medium text-dark placeholder:text-gray-400 outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/10"
              placeholder="admin@company.com"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-dark mb-1.5">Password</label>
            <input
              className="w-full px-3.5 py-2.5 rounded-xl border-[1.5px] border-border bg-white text-sm font-medium text-dark placeholder:text-gray-400 outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/10"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand hover:bg-brand-dark text-white text-sm font-bold transition-all disabled:opacity-60 shadow-lg shadow-brand/20 cursor-pointer"
          >
            {loading ? <span className="spinner" /> : <><Lock size={15} /> Masuk</>}
          </button>
        </form>

        <p className="text-center text-xs text-muted mt-6">© 2026 HRGA System. Enterprise Platform.</p>
      </div>
    </div>
  )
}

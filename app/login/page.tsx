'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppLogo } from '@/components/ui'
import { Lock, Mail, Eye, EyeOff, ArrowRight, Shield, Fingerprint, Server } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (
        process.env.NEXT_PUBLIC_ADMIN_USERNAME &&
        email === process.env.NEXT_PUBLIC_ADMIN_USERNAME &&
        password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD
      ) {
        console.warn('Using legacy local authentication. Please migrate to Supabase Auth.')
        sessionStorage.setItem('hrga_logged_in', 'true')
        sessionStorage.setItem('hrga_user', email)
        document.cookie = "hrga_legacy_auth=true; path=/; max-age=86400"
        router.push('/dashboard')
        return
      }

      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })

      if (error) throw error

      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Email atau password salah.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-surface">
      {/* Left — Illustration Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-surface-alt relative overflow-hidden flex-col justify-between p-12 border-r border-border">
        {/* Background effects */}
        <div className="absolute inset-0 opacity-40 grid-pattern" />
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent/10 rounded-full blur-[80px]" />

        {/* Logo */}
        <div className="relative">
          <AppLogo variant="dark" size="md" showText={false} />
        </div>

        {/* Center content */}
        <div className="relative space-y-8 z-10">
          <h2 className="text-4xl font-extrabold text-dark tracking-tight font-display leading-tight">
            Veneris HR<br />
            <span className="text-primary">Enterprise Workforce Platform</span>
          </h2>
          <p className="text-base text-muted leading-relaxed max-w-md">
            Platform HRIS modern untuk mengelola absensi, payroll, employee management, rekrutmen, dan analitik SDM dalam satu ekosistem terintegrasi.
          </p>

          {/* Security badges */}
          <div className="space-y-4 pt-4">
            <SecurityBadge icon={<Shield size={16} />} title="SSR Authentication" text="HTTP-only cookies protection" />
            <SecurityBadge icon={<Fingerprint size={16} />} title="Row Level Security" text="Granular PostgreSQL policies" />
            <SecurityBadge icon={<Server size={16} />} title="End-to-end Encryption" text="AES-256 encrypted storage" />
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-xs text-muted-light font-medium uppercase tracking-widest">
            Protected by enterprise-grade security
          </p>
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 gradient-mesh opacity-50" />

        <div className="relative w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex justify-center mb-8 lg:hidden">
            <AppLogo size="lg" variant="dark" />
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-extrabold text-dark tracking-tight font-display">
              Welcome Back
            </h1>
            <p className="text-sm text-muted mt-2">
              Masuk ke dashboard HR Anda
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 text-red-700 text-sm font-medium mb-6 border border-red-100 animate-scale-in shadow-sm">
              <span className="shrink-0 bg-red-100 p-1 rounded-full"><Lock size={14} className="text-red-600" /></span>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-dark mb-2 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-light" />
                <input
                  className="input-base !pl-11 !py-3 !text-base shadow-sm"
                  placeholder="admin@company.com"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoFocus
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-dark uppercase tracking-wider">Password</label>
                <button
                  type="button"
                  className="text-xs text-primary font-bold hover:text-primary-dark transition-colors cursor-pointer"
                >
                  Lupa password?
                </button>
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-light" />
                <input
                  className="input-base !pl-11 !pr-11 !py-3 !text-base shadow-sm"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-light hover:text-dark transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full !py-3.5 !text-base !rounded-xl shadow-lg mt-2"
            >
              {loading ? <span className="spinner spinner-sm border-white border-t-transparent" /> : <>Sign In <ArrowRight size={18} /></>}
            </button>
          </form>

          <p className="text-center text-xs text-muted mt-14">
            © 2026 Veneris HR. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

function SecurityBadge({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-border shadow-sm">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-bold text-dark">{title}</h4>
        <p className="text-xs text-muted mt-0.5">{text}</p>
      </div>
    </div>
  )
}

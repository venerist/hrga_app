'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppLogo } from '@/components/ui'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setSent(true)
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface relative overflow-hidden">
      <div className="absolute inset-0 gradient-mesh opacity-50" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-[80px]" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-[80px]" />

      <div className="relative w-full max-w-md px-6">
        <div className="glass-card rounded-2xl p-8 shadow-elevated animate-scale-in">
          <div className="flex flex-col items-center mb-8">
            <AppLogo size="lg" variant="dark" />
          </div>

          {sent ? (
            <div className="text-center animate-fade-in-up">
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-secondary" />
              </div>
              <h2 className="text-xl font-bold text-dark mb-2">Email Terkirim!</h2>
              <p className="text-sm text-muted mb-6">
                Kami telah mengirim link reset password ke <strong>{email}</strong>. Silakan cek inbox Anda.
              </p>
              <button onClick={() => router.push('/login')} className="btn-primary w-full !py-3 !rounded-xl">
                Kembali ke Login
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h1 className="text-xl font-extrabold text-dark font-display">Reset Password</h1>
                <p className="text-sm text-muted mt-2">Masukkan email untuk menerima link reset password</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-dark mb-2">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      className="input-base !pl-10"
                      placeholder="admin@company.com"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      autoFocus
                      required
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full !py-3 !rounded-xl">
                  {loading ? <span className="spinner spinner-sm" /> : 'Kirim Link Reset'}
                </button>
              </form>

              <button
                onClick={() => router.push('/login')}
                className="w-full mt-4 flex items-center justify-center gap-2 text-sm text-muted hover:text-dark transition-colors cursor-pointer font-medium"
              >
                <ArrowLeft size={14} /> Kembali ke Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

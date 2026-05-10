'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const USERS: Record<string, string> = {
  admin: 'hrga2024',
  hr: 'hr1234',
}

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
      if (USERS[username] === password) {
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
    <div className="login-wrap">
      <div className="login-card">
        <div style={{ marginBottom: 28, textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>🟠</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#1c1917' }}>
            HRGA System
          </div>
          <div style={{ fontSize: '0.8rem', color: '#78716c', marginTop: 4 }}>
            Human Resource & General Affairs
          </div>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: 16 }}>
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              className="form-input"
              placeholder="admin / hr"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoFocus
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : '🔐 Masuk'}
          </button>
        </form>
      </div>
    </div>
  )
}

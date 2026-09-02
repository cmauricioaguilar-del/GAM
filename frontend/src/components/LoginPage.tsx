import { useState, FormEvent } from 'react'

const NAVY = '#0B1C2E'
const BLUE = '#1262A8'

interface Props {
  onLogin: (user: string, pass: string) => boolean
}

export function LoginPage({ onLogin }: Props) {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(false)
    // Pequeño delay para evitar timing attacks triviales
    setTimeout(() => {
      const ok = onLogin(user, pass)
      if (!ok) {
        setError(true)
        setPass('')
      }
      setLoading(false)
    }, 400)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: NAVY,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: 24,
    }}>
      <div style={{
        background: '#1E293B',
        border: '1px solid #334155',
        borderRadius: 14,
        padding: '44px 40px',
        width: '100%',
        maxWidth: 380,
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 52, height: 52,
            background: BLUE,
            borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff">
              <path d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 4h2v-2h2v2h2v2h-2v2h-2v-2h-2v-2z"/>
            </svg>
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: -0.5 }}>GAM Gestión</div>
          <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>Centro Cultural Gabriela Mistral</div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94A3B8', marginBottom: 6, letterSpacing: 0.3 }}>
              USUARIO
            </label>
            <input
              type="text"
              value={user}
              onChange={e => { setUser(e.target.value); setError(false) }}
              autoComplete="username"
              autoFocus
              required
              style={{
                width: '100%', padding: '11px 14px',
                background: '#0F172A', border: `1px solid ${error ? '#EF4444' : '#334155'}`,
                borderRadius: 8, color: '#F1F5F9', fontSize: 14,
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94A3B8', marginBottom: 6, letterSpacing: 0.3 }}>
              CONTRASEÑA
            </label>
            <input
              type="password"
              value={pass}
              onChange={e => { setPass(e.target.value); setError(false) }}
              autoComplete="current-password"
              required
              style={{
                width: '100%', padding: '11px 14px',
                background: '#0F172A', border: `1px solid ${error ? '#EF4444' : '#334155'}`,
                borderRadius: 8, color: '#F1F5F9', fontSize: 14,
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <div style={{
              background: '#450A0A', border: '1px solid #7F1D1D',
              borderRadius: 8, padding: '10px 14px', marginBottom: 16,
              fontSize: 13, color: '#FCA5A5',
            }}>
              Usuario o contraseña incorrectos.
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '12px',
              background: loading ? '#1E3A5F' : BLUE,
              border: 'none', borderRadius: 8,
              color: '#fff', fontSize: 14, fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s',
              letterSpacing: 0.3,
            }}
          >
            {loading ? 'Verificando…' : 'Ingresar'}
          </button>
        </form>

        <div style={{ marginTop: 28, textAlign: 'center', fontSize: 11, color: '#334155' }}>
          Sistema de uso interno · Acceso restringido
        </div>
      </div>
    </div>
  )
}

import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom'
import { Dashboard } from './modules/Dashboard'
import { Gastos } from './modules/Gastos'
import { Ingresos } from './modules/Ingresos'
import { Ticketing } from './modules/Ticketing'

const NAVY = '#0B1C2E'
const BLUE = '#1262A8'

const navItems = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/gastos', label: 'Gastos', icon: '💰' },
  { path: '/ingresos', label: 'Ingresos', icon: '📈' },
  { path: '/ticketing', label: 'Ticketing', icon: '🎫' },
]

function Sidebar() {
  return (
    <nav style={{
      width: 220,
      background: NAVY,
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
      zIndex: 100
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: -0.5 }}>PPTO-GAM</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>Control de Gestión</div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 6 }}>
          Centro Cultural Gabriela Mistral
        </div>
      </div>

      {/* Nav links */}
      <div style={{ padding: '16px 12px', flex: 1 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, paddingLeft: 8 }}>
          Módulos
        </div>
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 8,
              marginBottom: 4,
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: isActive ? 700 : 400,
              color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
              background: isActive ? BLUE : 'transparent',
              transition: 'all 0.15s'
            })}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>
        GAM · 2026 · Prototipo v0.1
      </div>
    </nav>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <Sidebar />
        <main style={{ marginLeft: 220, flex: 1, minHeight: '100vh', overflowX: 'hidden' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/gastos" element={<Gastos />} />
            <Route path="/ingresos" element={<Ingresos />} />
            <Route path="/ticketing" element={<Ticketing />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

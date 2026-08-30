interface KpiCardProps {
  titulo: string
  valor: string
  subtitulo?: string
  color?: string
  icon?: string
}

export function KpiCard({ titulo, valor, subtitulo, color = '#1262A8', icon }: KpiCardProps) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 12,
      padding: '20px 24px',
      borderLeft: `4px solid ${color}`,
      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }}>
      <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {icon && <span style={{ marginRight: 6 }}>{icon}</span>}
        {titulo}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: '#0B1C2E', lineHeight: 1.2 }}>
        {valor}
      </div>
      {subtitulo && (
        <div style={{ fontSize: 12, color: '#94a3b8' }}>{subtitulo}</div>
      )}
    </div>
  )
}

interface SemaforoProps {
  pct: number
  size?: number
}

export function Semaforo({ pct, size = 14 }: SemaforoProps) {
  const color = pct >= 0.95 ? '#22c55e' : pct >= 0.80 ? '#f59e0b' : '#ef4444'
  return (
    <span
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        flexShrink: 0
      }}
      title={`${(pct * 100).toFixed(1)}% ejecución`}
    />
  )
}

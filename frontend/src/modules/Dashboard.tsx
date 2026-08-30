import { useGastos } from '../hooks/useGastos'
import { useIngresos } from '../hooks/useIngresos'
import { useTicketing } from '../hooks/useTicketing'
import { KpiCard } from '../components/KpiCard'
import { Semaforo } from '../components/Semaforo'
import { fmtM, fmtPct, shortName } from '../components/fmt'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'

const NAVY = '#0B1C2E'
const BLUE = '#1262A8'
const COLORS = ['#1262A8','#0ea5e9','#06b6d4','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#f97316']

export function Dashboard() {
  const gastos = useGastos()
  const ingresos = useIngresos()
  const ticketing = useTicketing()

  const pctGastos = gastos.totalReal / gastos.totalPpto

  const areasChart = gastos.areas.map(a => ({
    area: a.area.length > 18 ? a.area.slice(0, 18) + '…' : a.area,
    Real: Math.round(a.total_real),
    Ppto: Math.round(a.total_ppto),
    pct: a.pct_ejecucion
  }))

  const topEventos = ticketing.eventos.slice(0, 5).map(e => ({
    name: shortName(e.evento, 28),
    ingreso: Math.round(e.ingresos_netos),
    tickets: e.total_tickets
  }))

  const ingresoPie = [
    { name: 'Locatarios', value: Math.round(ingresos.totalLocatarios) },
    { name: 'Espacios', value: Math.round(ingresos.totalEspacios) },
    { name: 'Auspicios', value: Math.round(ingresos.totalAuspicios) },
    { name: 'Ticketing', value: Math.round(ticketing.pagos.total) },
  ].filter(d => d.value > 0)

  return (
    <div style={{ padding: '24px 32px', maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ color: NAVY, fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
        Dashboard Ejecutivo
      </h1>
      <p style={{ color: '#64748b', marginBottom: 24, fontSize: 14 }}>
        GAM · Centro Cultural Gabriela Mistral · 2026 · Cifras en M$
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}>
        <KpiCard
          titulo="Gasto Total Real"
          valor={fmtM(gastos.totalReal)}
          subtitulo={`Ppto: ${fmtM(gastos.totalPpto)}`}
          color={pctGastos >= 0.95 ? '#22c55e' : pctGastos >= 0.80 ? '#f59e0b' : '#ef4444'}
          icon="💰"
        />
        <KpiCard
          titulo="% Ejecuéción Gastos"
          valor={fmtPct(pctGastos)}
          subtitulo="Meta: ≥ 95%"
          color={BLUE}
          icon="📊"
        />
        <KpiCard
          titulo="Ingresos Ticketing Jul"
          valor={fmtM(ticketing.pagos.total)}
          subtitulo={`${ticketing.totalTickets.toLocaleString('es-CL')} tickets vendidos`}
          color="#10b981"
          icon="🏟️"
        />
        <KpiCard
          titulo="Eventos Activos Jul"
          valor={ticketing.totalEventos.toString()}
          subtitulo="Julio 2026"
          color="#8b5cf6"
          icon="🎭"
        />
        <KpiCard
          titulo="Locatarios"
          valor={fmtM(ingresos.totalLocatarios)}
          subtitulo={`${ingresos.locatarios.length} locatarios activos`}
          color="#f59e0b"
          icon="🏪"
        />
        <KpiCard
          titulo="Auspicios"
          valor={fmtM(ingresos.totalAuspicios)}
          subtitulo={`${ingresos.auspicios.length} auspiciadores`}
          color="#ec4899"
          icon="🤝"
        />
      </div>

      <section style={{ background: '#fff', borderRadius: 12, padding: 24, marginBottom: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: NAVY, marginBottom: 16 }}>
          Estado de Ejecución por Área
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {gastos.areas.map(a => (
            <div key={a.area} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', border: '1px solid #e2e8f0', borderRadius: 8 }}>
              <Semaforo pct={a.pct_ejecucion} size={16} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: NAVY }}>{a.area}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>
                  {fmtM(a.total_real)} / {fmtM(a.total_ppto)} · {fmtPct(a.pct_ejecucion)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        <section style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: NAVY, marginBottom: 16 }}>
            Gastos: Real vs Presupuesto por Área
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={areasChart} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={v => `${(v/1000).toFixed(0)}M`} />
              <YAxis type="category" dataKey="area" tick={{ fontSize: 10 }} width={110} />
              <Tooltip formatter={(v: number) => fmtM(v)} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Ppto" fill="#cbd5e1" radius={[0,4,4,0]} />
              <Bar dataKey="Real" fill={BLUE} radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: NAVY, marginBottom: 16 }}>
            Top 5 Eventos por Ingreso · Julio 2026
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topEventos} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={v => `${v.toFixed(0)}`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={140} />
              <Tooltip formatter={(v: number) => fmtM(v)} />
              <Bar dataKey="ingreso" fill="#10b981" radius={[0,4,4,0]} name="Ingreso (M$)" />
            </BarChart>
          </ResponsiveContainer>
        </section>
      </div>

      <section style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: NAVY, marginBottom: 16 }}>
          Composición de Ingresos
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={ingresoPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}>
                {ingresoPie.map((_entry, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => fmtM(v)} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  )
}

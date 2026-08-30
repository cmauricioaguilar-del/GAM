import { useState } from 'react'
import { useIngresos } from '../hooks/useIngresos'
import { fmtM } from '../components/fmt'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'

const NAVY = '#0B1C2E'
const BLUE = '#1262A8'
const COLORS = ['#1262A8','#0ea5e9','#06b6d4','#10b981','#f59e0b','#ef4444','#8b5cf6']
const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

type Tab = 'locatarios' | 'espacios' | 'auspicios'

export function Ingresos() {
  const ingresos = useIngresos()
  const [tab, setTab] = useState<Tab>('locatarios')

  const locChart = ingresos.locatarios.map((l, i) => ({
    name: l.locatario.length > 20 ? l.locatario.slice(0,20)+'…' : l.locatario,
    total: Math.round(l.total),
    color: COLORS[i % COLORS.length]
  })).sort((a,b) => b.total - a.total)

  const locMeses = MESES.map((mes, idx) => {
    const row: Record<string, string | number> = { mes }
    ingresos.locatarios.forEach(l => {
      const v = l.meses[idx]?.valor ?? 0
      row[l.locatario] = Math.round(v)
    })
    return row
  })

  const espaciosPie = [
    { name: 'Comercial', value: ingresos.espacios.find(e => e.espacio === 'Comercial')?.total ?? 0 },
    { name: 'Artístico', value: ingresos.espacios.find(e => e.espacio === 'Artistico')?.total ?? 0 },
  ].filter(d => d.value > 0)

  return (
    <div style={{ padding: '24px 32px', maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ color: NAVY, fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
        Ingresos Operacionales 2026
      </h1>
      <p style={{ color: '#64748b', marginBottom: 24, fontSize: 14 }}>
        GAM · Cifras en M$ (miles de pesos)
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Locatarios', total: ingresos.totalLocatarios, n: ingresos.locatarios.length, color: BLUE },
          { label: 'Espacios', total: ingresos.totalEspacios, n: ingresos.espacios.length, color: '#10b981' },
          { label: 'Auspicios', total: ingresos.totalAuspicios, n: ingresos.auspicios.length, color: '#f59e0b' },
        ].map(k => (
          <div key={k.label} style={{ background: '#fff', borderRadius: 10, padding: '16px 20px', borderLeft: `4px solid ${k.color}`, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: NAVY }}>{fmtM(k.total, 0)}</div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>{k.n} activos</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, borderBottom: '2px solid #e2e8f0' }}>
        {(['locatarios','espacios','auspicios'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '8px 20px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: tab === t ? 700 : 400,
              color: tab === t ? BLUE : '#64748b',
              borderBottom: tab === t ? `3px solid ${BLUE}` : '3px solid transparent',
              marginBottom: -2,
              textTransform: 'capitalize'
            }}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'locatarios' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div style={{ background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 12 }}>Ingresos Anuales por Locatario</div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={locChart} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={v => `${v.toFixed(0)}`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={120} />
                <Tooltip formatter={(v: number) => fmtM(v)} />
                <Bar dataKey="total" name="Total (M$)" radius={[0,4,4,0]}>
                  {locChart.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: NAVY }}>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 12, color: '#fff' }}>Locatario</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', fontSize: 12, color: '#fff' }}>Total M$</th>
                </tr>
              </thead>
              <tbody>
                {ingresos.locatarios.map((l, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#f8fafc' : '#fff' }}>
                    <td style={{ padding: '10px 14px', fontSize: 13, color: NAVY, fontWeight: 500 }}>{l.locatario}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontSize: 13, color: BLUE, fontWeight: 600 }}>{fmtM(l.total, 1)}</td>
                  </tr>
                ))}
                <tr style={{ background: '#e2e8f0', fontWeight: 700 }}>
                  <td style={{ padding: '10px 14px', fontSize: 13, color: NAVY }}>Total</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontSize: 13, color: NAVY }}>{fmtM(ingresos.totalLocatarios, 1)}</td>
                </tr>
              </tbody>
            </table>

            <div style={{ padding: '16px 14px', borderTop: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: NAVY, marginBottom: 10 }}>Evolución Mensual</div>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={locMeses}>
                  <XAxis dataKey="mes" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 9 }} tickFormatter={v => `${v}`} />
                  <Tooltip formatter={(v: number) => fmtM(v)} />
                  {ingresos.locatarios.map((l, i) => (
                    <Bar key={l.locatario} dataKey={l.locatario} stackId="a" fill={COLORS[i % COLORS.length]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {tab === 'espacios' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div style={{ background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 16 }}>Distribución por Tipo</div>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={espaciosPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}
                  label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}>
                  {espaciosPie.map((_e, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => fmtM(v)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: NAVY }}>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 12, color: '#fff' }}>Espacio</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 12, color: '#fff' }}>Tipo</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', fontSize: 12, color: '#fff' }}>Total M$</th>
                </tr>
              </thead>
              <tbody>
                {ingresos.espacios.map((e, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#f8fafc' : '#fff' }}>
                    <td style={{ padding: '10px 14px', fontSize: 13, color: NAVY }}>{e.espacio}</td>
                    <td style={{ padding: '10px 14px', fontSize: 13, color: '#64748b' }}>{e.tipo}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontSize: 13, color: BLUE, fontWeight: 600 }}>{fmtM(e.total, 1)}</td>
                  </tr>
                ))}
                <tr style={{ background: '#e2e8f0', fontWeight: 700 }}>
                  <td colSpan={2} style={{ padding: '10px 14px', fontSize: 13, color: NAVY }}>Total</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontSize: 13, color: NAVY }}>{fmtM(ingresos.totalEspacios, 1)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'auspicios' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div style={{ background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 12 }}>Ingresos por Auspiciador</div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={ingresos.auspicios.map(a => ({ name: a.auspiciador, total: Math.round(a.total) }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => fmtM(v)} />
                <Bar dataKey="total" fill="#f59e0b" radius={[4,4,0,0]} name="Total M$" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: NAVY }}>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 12, color: '#fff' }}>Auspiciador</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', fontSize: 12, color: '#fff' }}>Total M$</th>
                </tr>
              </thead>
              <tbody>
                {ingresos.auspicios.map((a, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#f8fafc' : '#fff' }}>
                    <td style={{ padding: '10px 14px', fontSize: 13, color: NAVY, fontWeight: 500 }}>{a.auspiciador}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontSize: 13, color: '#f59e0b', fontWeight: 700 }}>{fmtM(a.total, 1)}</td>
                  </tr>
                ))}
                <tr style={{ background: '#e2e8f0', fontWeight: 700 }}>
                  <td style={{ padding: '10px 14px', fontSize: 13, color: NAVY }}>Total</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontSize: 13, color: NAVY }}>{fmtM(ingresos.totalAuspicios, 1)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

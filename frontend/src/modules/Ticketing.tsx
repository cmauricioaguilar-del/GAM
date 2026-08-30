import { useState } from 'react'
import { useTicketing } from '../hooks/useTicketing'
import { fmtM, fmtPct, shortEventName } from '../components/fmt'
import type { Evento } from '../types'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'

const NAVY = '#0B1C2E'
const BLUE = '#1262A8'
const GREEN = '#10b981'
const COLORS = ['#1262A8','#0ea5e9','#06b6d4','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#f97316']

function EventoDetail({ evento, onClose }: { evento: Evento; onClose: () => void }) {
  const nombre = shortEventName(evento.evento)

  const canalesData = evento.canales.map(c => ({
    name: c.canal,
    cantidad: c.cantidad
  }))

  const tiposData = evento.tipos_ticket.slice(0, 8).map(t => ({
    name: t.tipo.length > 30 ? t.tipo.slice(0,30)+'…' : t.tipo,
    ingreso: Math.round(t.ingreso)
  }))

  return (
    <div style={{ background: '#f8fafc', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0', marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: NAVY, marginBottom: 4 }}>{nombre}</h2>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>{evento.evento}</div>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: 6, padding: '4px 12px', cursor: 'pointer', fontSize: 12, color: '#64748b' }}
        >
          ✕ Cerrar
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Ingresos', valor: fmtM(evento.ingresos_netos, 1), color: GREEN },
          { label: 'Tickets Vendidos', valor: evento.total_tickets.toLocaleString('es-CL'), color: BLUE },
          { label: 'Cortesías', valor: `${evento.cortesias} (${fmtPct(evento.pct_cortesias)})`, color: '#f59e0b' },
          { label: 'Comisiones', valor: fmtM(evento.comisiones, 1), color: '#ef4444' },
        ].map(k => (
          <div key={k.label} style={{ background: '#fff', borderRadius: 8, padding: '12px 16px', borderLeft: `4px solid ${k.color}` }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>{k.label}</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: NAVY }}>{k.valor}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {canalesData.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: NAVY, marginBottom: 10 }}>Canales de Venta</div>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={canalesData} dataKey="cantidad" nameKey="name" cx="50%" cy="50%" outerRadius={60}
                  label={({ name, percent }) => `${name.slice(0,10)} ${(percent*100).toFixed(0)}%`}>
                  {canalesData.map((_e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
        {tiposData.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: NAVY, marginBottom: 10 }}>Por Tipo de Ticket</div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={tiposData} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 9 }} tickFormatter={v => `${v.toFixed(0)}`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={100} />
                <Tooltip formatter={(v: number) => fmtM(v)} />
                <Bar dataKey="ingreso" fill={BLUE} radius={[0,3,3,0]} name="Ingreso M$" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}

export function Ticketing() {
  const tick = useTicketing()
  const [selected, setSelected] = useState<Evento | null>(null)
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<'ranking'|'pagos'>('ranking')

  const filtered = tick.eventos.filter(e =>
    shortEventName(e.evento).toLowerCase().includes(search.toLowerCase())
  )

  const top10 = tick.eventos.slice(0, 10).map(e => ({
    name: shortEventName(e.evento).slice(0, 28),
    ingreso: Math.round(e.ingresos_netos),
    tickets: e.total_tickets
  }))

  return (
    <div style={{ padding: '24px 32px', maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ color: NAVY, fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
        Ticketing · Julio 2026
      </h1>
      <p style={{ color: '#64748b', marginBottom: 24, fontSize: 14 }}>
        GAM · Liquidación mensual · Cifras en M$ · Haga clic en un evento para ver el detalle
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Ingresos Netos', valor: fmtM(tick.totalIngresos, 1), color: GREEN },
          { label: 'Total Recaudado', valor: fmtM(tick.pagos.total, 1), color: BLUE },
          { label: 'Tickets Vendidos', valor: tick.totalTickets.toLocaleString('es-CL'), color: '#8b5cf6' },
          { label: 'Eventos', valor: tick.totalEventos.toString(), color: '#f59e0b' },
        ].map(k => (
          <div key={k.label} style={{ background: '#fff', borderRadius: 10, padding: '14px 18px', borderLeft: `4px solid ${k.color}`, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: NAVY }}>{k.valor}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, borderBottom: '2px solid #e2e8f0' }}>
        {([['ranking','Ranking Eventos'],['pagos','Medios de Pago']] as const).map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '8px 20px', border: 'none', background: 'none', cursor: 'pointer',
              fontSize: 14, fontWeight: tab === t ? 700 : 400,
              color: tab === t ? BLUE : '#64748b',
              borderBottom: tab === t ? `3px solid ${BLUE}` : '3px solid transparent',
              marginBottom: -2
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'ranking' && (
        <>
          {selected && (
            <EventoDetail evento={selected} onClose={() => setSelected(null)} />
          )}

          <div style={{ background: '#fff', borderRadius: 10, padding: 20, marginBottom: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 12 }}>Top 10 Eventos por Ingreso</div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={top10} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={v => `${v.toFixed(0)}`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={170} />
                <Tooltip formatter={(v: number) => fmtM(v)} />
                <Bar dataKey="ingreso" fill={GREEN} radius={[0,4,4,0]} name="Ingreso M$"
                  onClick={(d) => {
                    const ev = tick.eventos.find(e => shortEventName(e.evento).startsWith(d.name.replace('…','')))
                    if (ev) setSelected(ev)
                  }}
                  cursor="pointer"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: '#fff', borderRadius: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>Todos los Eventos</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar evento…"
                style={{ marginLeft: 'auto', padding: '6px 12px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 13, width: 220 }}
              />
            </div>
            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ position: 'sticky', top: 0 }}>
                  <tr style={{ background: NAVY }}>
                    <th style={{ padding: '9px 12px', textAlign: 'left', fontSize: 12, color: '#fff', width: 36 }}>#</th>
                    <th style={{ padding: '9px 12px', textAlign: 'left', fontSize: 12, color: '#fff' }}>Evento</th>
                    <th style={{ padding: '9px 12px', textAlign: 'right', fontSize: 12, color: '#fff' }}>Tickets</th>
                    <th style={{ padding: '9px 12px', textAlign: 'right', fontSize: 12, color: '#fff' }}>Cortesías</th>
                    <th style={{ padding: '9px 12px', textAlign: 'right', fontSize: 12, color: '#fff' }}>Ingresos M$</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((e, i) => (
                    <tr
                      key={i}
                      onClick={() => setSelected(e === selected ? null : e)}
                      style={{
                        background: e === selected ? '#eff6ff' : i % 2 === 0 ? '#f8fafc' : '#fff',
                        cursor: 'pointer'
                      }}
                    >
                      <td style={{ padding: '8px 12px', fontSize: 12, color: '#94a3b8' }}>{i+1}</td>
                      <td style={{ padding: '8px 12px', fontSize: 13, color: NAVY, fontWeight: 500 }}>
                        {shortEventName(e.evento)}
                      </td>
                      <td style={{ padding: '8px 12px', textAlign: 'right', fontSize: 13 }}>{e.total_tickets.toLocaleString('es-CL')}</td>
                      <td style={{ padding: '8px 12px', textAlign: 'right', fontSize: 12, color: '#f59e0b' }}>{e.cortesias}</td>
                      <td style={{ padding: '8px 12px', textAlign: 'right', fontSize: 13, color: GREEN, fontWeight: 600 }}>{fmtM(e.ingresos_netos, 1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === 'pagos' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div style={{ background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 12 }}>Por Medio de Pago</div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={tick.pagos.por_gateway.slice(0,10).map(g => ({
                  name: g.gateway.length > 22 ? g.gateway.slice(0,22)+'…' : g.gateway,
                  total: Math.round(g.total),
                  transacciones: g.transacciones
                }))}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={v => `${v.toFixed(0)}`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={140} />
                <Tooltip formatter={(v: number, name: string) => name === 'total' ? fmtM(v) : v.toLocaleString('es-CL')} />
                <Bar dataKey="total" fill={BLUE} radius={[0,4,4,0]} name="Total M$" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 16 }}>Por Canal de Venta</div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={tick.pagos.por_canal.map(c => ({ name: c.canal, value: Math.round(c.total) }))}
                  dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}
                  label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}
                >
                  {tick.pagos.por_canal.map((_e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => fmtM(v)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>

            <div style={{ marginTop: 16, borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: NAVY, marginBottom: 10 }}>Resumen</div>
              {tick.pagos.por_canal.map((c, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: 13, color: NAVY }}>{c.canal}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: COLORS[i % COLORS.length] }}>{fmtM(c.total, 1)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontWeight: 700 }}>
                <span style={{ fontSize: 13, color: NAVY }}>Total</span>
                <span style={{ fontSize: 13, color: NAVY }}>{fmtM(tick.pagos.total, 1)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { useGastos } from '../hooks/useGastos'
import { Semaforo } from '../components/Semaforo'
import { fmtM, fmtPct } from '../components/fmt'
import type { AreaGasto, ItemGasto } from '../types'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from 'recharts'

const NAVY = '#0B1C2E'
const BLUE = '#1262A8'

function ItemRow({ item, depth = 0 }: { item: ItemGasto; depth?: number }) {
  const [open, setOpen] = useState(false)
  const hasChildren = item.subitems && item.subitems.length > 0

  return (
    <>
      <tr
        style={{ cursor: hasChildren ? 'pointer' : 'default', background: depth === 0 ? '#f8fafc' : '#fff' }}
        onClick={() => hasChildren && setOpen(o => !o)}
      >
        <td style={{ padding: '8px 12px', paddingLeft: 12 + depth * 20, fontWeight: depth === 0 ? 600 : 400, fontSize: 13, color: NAVY }}>
          {hasChildren && <span style={{ marginRight: 6, fontSize: 10, color: '#94a3b8' }}>{open ? '▼' : '▶'}</span>}
          {item.nombre}
        </td>
        <td style={{ padding: '8px 12px', textAlign: 'right', fontSize: 13, color: '#475569' }}>
          {fmtM(item.total_real, 0)}
        </td>
        <td style={{ padding: '8px 12px', textAlign: 'right', fontSize: 13, color: '#94a3b8' }}>
          {fmtM(item.total_ppto, 0)}
        </td>
        <td style={{ padding: '8px 12px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Semaforo pct={item.pct_ejecucion} />
            <span style={{ fontSize: 12, color: '#475569' }}>{fmtPct(item.pct_ejecucion)}</span>
          </div>
        </td>
      </tr>
      {open && item.subitems.map((sub, i) => (
        <ItemRow key={i} item={sub} depth={depth + 1} />
      ))}
    </>
  )
}

function AreaDetail({ area }: { area: AreaGasto }) {
  const chartData = area.items.slice(0, 12).map(item => ({
    name: item.nombre.length > 22 ? item.nombre.slice(0, 22) + '…' : item.nombre,
    Real: Math.round(item.total_real),
    Ppto: Math.round(item.total_ppto),
    pct: item.pct_ejecucion
  }))

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ background: '#eff6ff', borderRadius: 8, padding: '12px 20px' }}>
          <div style={{ fontSize: 11, color: '#1262A8', fontWeight: 600, textTransform: 'uppercase' }}>Real Acumulado</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: NAVY }}>{fmtM(area.total_real, 0)}</div>
        </div>
        <div style={{ background: '#f1f5f9', borderRadius: 8, padding: '12px 20px' }}>
          <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Presupuesto</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#64748b' }}>{fmtM(area.total_ppto, 0)}</div>
        </div>
        <div style={{ background: area.pct_ejecucion >= 0.95 ? '#f0fdf4' : area.pct_ejecucion >= 0.80 ? '#fffbeb' : '#fef2f2', borderRadius: 8, padding: '12px 20px' }}>
          <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>% Ejecución</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: NAVY, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Semaforo pct={area.pct_ejecucion} size={16} />
            {fmtPct(area.pct_ejecucion)}
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 8, padding: 16, marginBottom: 20, border: '1px solid #e2e8f0' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: NAVY, marginBottom: 12 }}>
          Real vs Presupuesto por Ítem
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={v => `${v.toFixed(0)}`} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={140} />
            <Tooltip formatter={(v: number) => fmtM(v)} />
            <ReferenceLine x={0} stroke="#e2e8f0" />
            <Bar dataKey="Ppto" fill="#cbd5e1" radius={[0,3,3,0]} name="Presupuesto" />
            <Bar dataKey="Real" fill={BLUE} radius={[0,3,3,0]} name="Real" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: NAVY }}>
              <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 12, color: '#fff', fontWeight: 600 }}>{"Ítem"}</th>
              <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: 12, color: '#fff', fontWeight: 600 }}>Real (M$)</th>
              <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: 12, color: '#fff', fontWeight: 600 }}>Ppto (M$)</th>
              <th style={{ padding: '10px 12px', textAlign: 'center', fontSize: 12, color: '#fff', fontWeight: 600 }}>% Ejec.</th>
            </tr>
          </thead>
          <tbody>
            {area.items.map((item, i) => (
              <ItemRow key={i} item={item} depth={0} />
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background: '#0B1C2E10', borderTop: '2px solid #e2e8f0' }}>
              <td style={{ padding: '10px 12px', fontWeight: 700, fontSize: 13, color: NAVY }}>Total {area.area}</td>
              <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, fontSize: 13 }}>{fmtM(area.total_real, 0)}</td>
              <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, fontSize: 13, color: '#94a3b8' }}>{fmtM(area.total_ppto, 0)}</td>
              <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <Semaforo pct={area.pct_ejecucion} />
                  <span style={{ fontWeight: 700, fontSize: 13 }}>{fmtPct(area.pct_ejecucion)}</span>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

export function Gastos() {
  const gastos = useGastos()
  const [selectedArea, setSelectedArea] = useState<string | null>(null)

  const area = gastos.areas.find(a => a.area === selectedArea)
  const pctTotal = gastos.totalReal / gastos.totalPpto

  return (
    <div style={{ padding: '24px 32px', maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ color: NAVY, fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
        Presupuesto de Gastos 2026
      </h1>
      <p style={{ color: '#64748b', marginBottom: 24, fontSize: 14 }}>
        GAM · Cifras en M$ (miles de pesos) · Haga clic en un área para ver el detalle
      </p>

      <div style={{ background: '#fff', borderRadius: 12, padding: '16px 24px', marginBottom: 24, border: '2px solid #1262A8', display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Gasto Real Total</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: NAVY }}>{fmtM(gastos.totalReal, 0)}</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Presupuesto Total</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#94a3b8' }}>{fmtM(gastos.totalPpto, 0)}</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Ejecución Global</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: NAVY, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Semaforo pct={pctTotal} size={20} />
            {fmtPct(pctTotal)}
          </div>
        </div>
        <div style={{ fontSize: 12, color: '#94a3b8', marginLeft: 'auto' }}>
          {gastos.areas.length} áreas · {gastos.areas.reduce((s,a)=>s+a.items.length,0)} ítems
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12, marginBottom: 24 }}>
        {gastos.areas.map(a => (
          <div
            key={a.area}
            onClick={() => setSelectedArea(a.area === selectedArea ? null : a.area)}
            style={{
              background: selectedArea === a.area ? NAVY : '#fff',
              borderRadius: 10,
              padding: '14px 18px',
              cursor: 'pointer',
              border: `2px solid ${selectedArea === a.area ? NAVY : '#e2e8f0'}`,
              transition: 'all 0.15s',
              boxShadow: selectedArea === a.area ? '0 4px 12px rgba(11,28,46,0.2)' : '0 1px 3px rgba(0,0,0,0.06)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: selectedArea === a.area ? '#fff' : NAVY }}>{a.area}</span>
              <Semaforo pct={a.pct_ejecucion} size={14} />
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: selectedArea === a.area ? '#e0f2fe' : BLUE }}>
              {fmtM(a.total_real, 0)}
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>
              {fmtPct(a.pct_ejecucion)} de {fmtM(a.total_ppto, 0)}
            </div>
          </div>
        ))}
      </div>

      {area && (
        <div style={{ background: '#f8fafc', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: NAVY }}>{area.area}</h2>
            <button
              onClick={() => setSelectedArea(null)}
              style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: 6, padding: '4px 12px', cursor: 'pointer', fontSize: 12, color: '#64748b' }}
            >
              ✕ Cerrar
            </button>
          </div>
          <AreaDetail area={area} />
        </div>
      )}
    </div>
  )
}

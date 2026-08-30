import ticketingRaw from '../data/ticketing.json'
import type { TicketingData, Evento } from '../types'

const data = ticketingRaw as TicketingData

// Los ingresos de ticketing vienen en pesos — convertir a M$
const SCALE = 1000

const eventos: Evento[] = data.eventos.map(e => ({
  ...e,
  ingresos_netos: e.ingresos_netos / SCALE,
  comisiones: e.comisiones / SCALE,
  tipos_ticket: e.tipos_ticket.map(t => ({ ...t, ingreso: t.ingreso / SCALE }))
}))

const pagos = {
  ...data.pagos,
  total: data.pagos.total / SCALE,
  por_gateway: data.pagos.por_gateway.map(g => ({ ...g, total: g.total / SCALE })),
  por_canal: data.pagos.por_canal.map(c => ({ ...c, total: c.total / SCALE }))
}

export function useTicketing() {
  return {
    eventos,
    pagos,
    meta: data.meta,
    resumenMes: data.resumen_mes,
    reporte2026: data.reporte_2026,
    totalIngresos: eventos.reduce((s, e) => s + e.ingresos_netos, 0),
    totalTickets: eventos.reduce((s, e) => s + e.total_tickets, 0),
    totalEventos: eventos.length,
  }
}

export function useEvento(nombre: string): Evento | undefined {
  return eventos.find(e => e.evento === nombre)
}

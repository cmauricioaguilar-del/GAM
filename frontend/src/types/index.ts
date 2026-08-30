// ─── Gastos ─────────────────────────────────────────────────────────────────────────────────

export interface MesGasto {
  mes: string
  real: number
  ppto: number
}

export interface ItemGasto {
  nombre: string
  meses?: MesGasto[]
  total_real: number
  total_ppto: number
  pct_ejecucion: number
  subitems?: ItemGasto[]
}

export interface AreaGasto {
  area: string
  total_real: number
  total_ppto: number
  pct_ejecucion: number
  items: ItemGasto[]
}

export interface GastosData {
  meta: { fuente: string; unidad: string; anio: number }
  areas: AreaGasto[]
}

// ─── Ingresos ─────────────────────────────────────────────────────────────────────────────────

export interface MesIngreso {
  mes: string
  valor: number
}

export interface Locatario {
  locatario: string
  meses: MesIngreso[]
  total: number
}

export interface Espacio {
  espacio: string
  tipo: string
  meses: MesIngreso[]
  total: number
}

export interface Auspicio {
  auspiciador: string
  meses: MesIngreso[]
  total: number
}

export interface LineaIngreso {
  linea: string
  valores: number[]
}

export interface LineaConsolidado {
  linea: string
  valores: number[]
}

export interface IngresosData {
  meta: { fuentes: string[]; unidad: string; anio: number }
  pdc_resumen: LineaIngreso[]
  locatarios: Locatario[]
  espacios: Espacio[]
  auspicios: Auspicio[]
  consolidado: {
    historico: Array<{ concepto: string; series: number[] }>
    operacional_2026: LineaConsolidado[]
  }
}

// ─── Ticketing ────────────────────────────────────────────────────────────────────────────────

export interface CanalTicket {
  canal: string
  cantidad: number
}

export interface TipoTicket {
  tipo: string
  ingreso: number
}

export interface Evento {
  evento: string
  total_tickets: number
  cortesias: number
  pct_cortesias: number
  ingresos_netos: number
  comisiones: number
  canales: CanalTicket[]
  tipos_ticket: TipoTicket[]
}

export interface Gateway {
  gateway: string
  transacciones: number
  total: number
}

export interface CanalPago {
  canal: string
  transacciones: number
  total: number
}

export interface TicketingData {
  meta: { fuentes: string[]; unidad: string; mes_transaccional: string }
  resumen_mes: Record<string, number>
  eventos: Evento[]
  pagos: {
    total: number
    por_gateway: Gateway[]
    por_canal: CanalPago[]
  }
  reporte_2026: {
    meses: unknown[]
    por_tipo: Array<{ tipo: string; valores: number[] }>
  }
}

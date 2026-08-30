import ingresosRaw from '../data/ingresos.json'
import type { IngresosData } from '../types'

const data = ingresosRaw as IngresosData

export function useIngresos() {
  return {
    locatarios: data.locatarios,
    espacios: data.espacios,
    auspicios: data.auspicios,
    pdcResumen: data.pdc_resumen,
    consolidado: data.consolidado,
    meta: data.meta,
    totalLocatarios: data.locatarios.reduce((s, l) => s + l.total, 0),
    totalEspacios: data.espacios.reduce((s, e) => s + e.total, 0),
    totalAuspicios: data.auspicios.reduce((s, a) => s + a.total, 0),
  }
}

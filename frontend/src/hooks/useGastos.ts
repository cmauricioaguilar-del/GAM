import gastosRaw from '../data/gastos.json'
import type { GastosData, AreaGasto, ItemGasto } from '../types'

const data = gastosRaw as GastosData

// Los valores vienen en pesos — convertir a M$ (miles)
const SCALE = 1000

function scaleItem(item: ItemGasto): ItemGasto {
  return {
    ...item,
    total_real: item.total_real / SCALE,
    total_ppto: item.total_ppto / SCALE,
    meses: item.meses.map(m => ({ ...m, real: m.real / SCALE, ppto: m.ppto / SCALE })),
    subitems: item.subitems.map(scaleItem)
  }
}

const areas: AreaGasto[] = data.areas.map(a => ({
  ...a,
  total_real: a.total_real / SCALE,
  total_ppto: a.total_ppto / SCALE,
  items: a.items.map(scaleItem)
}))

export function useGastos() {
  return {
    areas,
    meta: data.meta,
    totalReal: areas.reduce((s, a) => s + a.total_real, 0),
    totalPpto: areas.reduce((s, a) => s + a.total_ppto, 0),
  }
}

export function useAreaGastos(areaName: string): AreaGasto | undefined {
  return areas.find(a => a.area === areaName)
}

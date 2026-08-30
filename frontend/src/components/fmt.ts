/** Formatea un número como M$ con separador de miles chileno */
export function fmtM(value: number, decimals = 0): string {
  return value.toLocaleString('es-CL', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }) + ' M$'
}

/** Formatea porcentaje */
export function fmtPct(value: number): string {
  return (value * 100).toFixed(1) + '%'
}

/** Nombre corto de evento (antes del código numérico final) */
export function shortEventName(nombre: string): string {
  return nombre.replace(/\s*-\s*\d+\s*$/, '').trim()
}

/** Nombre corto de evento para charts */
export function shortName(nombre: string, maxLen = 30): string {
  const s = shortEventName(nombre)
  return s.length > maxLen ? s.slice(0, maxLen - 1) + '…' : s
}

const MONTHS_PT = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
]

const MONTHS_SHORT_PT = [
  'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
  'jul', 'ago', 'set', 'out', 'nov', 'dez'
]

function parseEventDate(date: string): { day: number; month: number; year: number } {
  if (date.includes('-')) {
    const [y, m, d] = date.split('-').map(Number)
    return { day: d, month: m, year: y }
  }
  const [d, m, y] = date.split('/').map(Number)
  return { day: d, month: m, year: y }
}

export function formatEventDateTime(date: string, time: string): string {
  const { day, month, year } = parseEventDate(date)
  const monthName = MONTHS_PT[month - 1]
  const timeFormatted = time.substring(0, 5)
  return `${day} de ${monthName} de ${year} às ${timeFormatted}`
}

export function formatShortEventDateTime(date: string, time: string): string {
  const { day, month } = parseEventDate(date)
  return `${day} ${MONTHS_SHORT_PT[month - 1]} · ${time.substring(0, 5)}`
}

export const formatRelativeTime = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'agora'
  if (minutes < 60) return `${minutes}min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  return `${days}d`
}

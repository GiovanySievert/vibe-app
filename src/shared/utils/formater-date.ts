const MONTHS_PT = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
]

export function formatEventDateTime(date: string, time: string): string {
  let day: number, month: number, year: number

  if (date.includes('-')) {
    const [y, m, d] = date.split('-').map(Number)
    year = y; month = m; day = d
  } else {
    const [d, m, y] = date.split('/').map(Number)
    day = d; month = m; year = y
  }

  const monthName = MONTHS_PT[month - 1]
  const timeFormatted = time.substring(0, 5)

  return `${day} de ${monthName} de ${year} às ${timeFormatted}`
}

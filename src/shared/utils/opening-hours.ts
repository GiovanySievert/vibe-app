import { PlaceOpeningHour } from '@src/shared/domain'

export type GroupedOpeningHours = {
  label: string
  opensAt: string
  closesAt: string
  isClosed: boolean
}

export type OpeningStatus = {
  isOpen: boolean
  closesAt?: string
  opensAt?: string
  nextOpenWeekday?: number
}

export const formatTimeRange = (opensAt: string, closesAt: string): string => {
  return `${opensAt.substring(0, 5)} - ${closesAt.substring(0, 5)}`
}

export const formatTime = (time: string): string => time.substring(0, 5)

const toMinutes = (time: string): number => {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

const sortByWeekday = (hours: PlaceOpeningHour[]): PlaceOpeningHour[] => {
  return [...hours].sort((a, b) => a.weekday - b.weekday)
}

const isSameWindow = (a: PlaceOpeningHour, b: PlaceOpeningHour): boolean => {
  if (a.isClosed && b.isClosed) return true
  if (a.isClosed !== b.isClosed) return false
  return a.opensAt === b.opensAt && a.closesAt === b.closesAt
}

const labelFromRun = (
  run: PlaceOpeningHour[],
  weekdayLabels: Record<string, string>
): string => {
  const first = weekdayLabels[String(run[0].weekday)]
  if (run.length === 1) return first
  const last = weekdayLabels[String(run[run.length - 1].weekday)]
  return `${first}-${last}`
}

export const groupConsecutiveDays = (
  hours: PlaceOpeningHour[],
  weekdayLabels: Record<string, string>
): GroupedOpeningHours[] => {
  if (!hours.length) return []

  const sorted = sortByWeekday(hours)
  const groups: GroupedOpeningHours[] = []
  let run: PlaceOpeningHour[] = [sorted[0]]

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1]
    const curr = sorted[i]
    const consecutive = curr.weekday === prev.weekday + 1
    if (consecutive && isSameWindow(prev, curr)) {
      run.push(curr)
      continue
    }
    groups.push({
      label: labelFromRun(run, weekdayLabels),
      opensAt: run[0].opensAt,
      closesAt: run[0].closesAt,
      isClosed: run[0].isClosed
    })
    run = [curr]
  }

  groups.push({
    label: labelFromRun(run, weekdayLabels),
    opensAt: run[0].opensAt,
    closesAt: run[0].closesAt,
    isClosed: run[0].isClosed
  })

  return groups
}

const findOpenWindow = (
  hours: PlaceOpeningHour[],
  weekday: number,
  minutesNow: number
): PlaceOpeningHour | null => {
  const today = hours.find((h) => h.weekday === weekday && !h.isClosed)
  if (today) {
    const open = toMinutes(today.opensAt)
    const close = toMinutes(today.closesAt)
    if (close > open && minutesNow >= open && minutesNow < close) return today
    if (close <= open && minutesNow >= open) return today
  }

  const yesterday = hours.find(
    (h) => h.weekday === (weekday + 6) % 7 && !h.isClosed
  )
  if (yesterday) {
    const open = toMinutes(yesterday.opensAt)
    const close = toMinutes(yesterday.closesAt)
    if (close <= open && minutesNow < close) return yesterday
  }

  return null
}

const findNextOpen = (
  hours: PlaceOpeningHour[],
  weekday: number,
  minutesNow: number
): { day: PlaceOpeningHour; weekday: number } | null => {
  const todayOpen = hours.find(
    (h) => h.weekday === weekday && !h.isClosed && toMinutes(h.opensAt) > minutesNow
  )
  if (todayOpen) return { day: todayOpen, weekday }

  for (let i = 1; i <= 7; i++) {
    const wd = (weekday + i) % 7
    const next = hours.find((h) => h.weekday === wd && !h.isClosed)
    if (next) return { day: next, weekday: wd }
  }
  return null
}

export const getCurrentStatus = (
  hours: PlaceOpeningHour[],
  now: Date = new Date()
): OpeningStatus => {
  if (!hours.length) return { isOpen: false }

  const weekday = now.getDay()
  const minutesNow = now.getHours() * 60 + now.getMinutes()
  const openWindow = findOpenWindow(hours, weekday, minutesNow)

  if (openWindow) {
    return { isOpen: true, closesAt: openWindow.closesAt }
  }

  const next = findNextOpen(hours, weekday, minutesNow)
  if (!next) return { isOpen: false }

  return {
    isOpen: false,
    opensAt: next.day.opensAt,
    nextOpenWeekday: next.weekday
  }
}

export const formatDistance = (meters?: number | null) => {
  if (meters === null || meters === undefined || !Number.isFinite(meters)) {
    return ''
  }
  if (meters < 1000) return `${Math.round(meters)}m`
  return `${(meters / 1000).toFixed(1)}km`
}

import { PlaceReviewBadgeTier } from '@src/features/users-profile/services'
import { theme } from '@src/shared/constants/theme'

export type BadgeMilestone = {
  tier: PlaceReviewBadgeTier
  minReviews: number
  label: string
}

export const BADGE_MILESTONES: BadgeMilestone[] = [
  { tier: 'regular', minReviews: 3, label: 'cliente' },
  { tier: 'fan', minReviews: 5, label: 'fã' },
  { tier: 'frequent', minReviews: 10, label: 'VIP' },
  { tier: 'legend', minReviews: 15, label: 'lenda' },
  { tier: 'king', minReviews: 20, label: 'rei' }
]

export const space = (value: keyof typeof theme.spacing) => Number.parseFloat(theme.spacing[value])

export const REVIEW_COUNT_CIRCLE_SIZE = space(16) * 3
export const REVIEW_COUNT_RING_STROKE_WIDTH = 4
export const REVIEW_COUNT_RING_RADIUS = (REVIEW_COUNT_CIRCLE_SIZE - REVIEW_COUNT_RING_STROKE_WIDTH) / 2
export const REVIEW_COUNT_RING_CIRCUMFERENCE = 2 * Math.PI * REVIEW_COUNT_RING_RADIUS

export const MILESTONES_CARD_HIDDEN_OFFSET = 220
export const MILESTONES_VISIBLE_MS = 5000
export const MILESTONES_HIDE_DURATION_MS = 460
export const MILESTONES_REMOVE_DELAY_MS = MILESTONES_VISIBLE_MS + MILESTONES_HIDE_DURATION_MS

export const UNLOCKED_GRADIENT_COLORS: [string, string, string] = [
  'rgba(111,232,168,0.29)',
  'rgba(45,90,61,0.29)',
  theme.colors.background
]
export const UNLOCKED_GRADIENT_LOCATIONS: [number, number, number] = [0, 0.32, 0.72]

export const REVIEW_COUNT_UNLOCKED_BG = 'rgba(111,232,168,0.12)'

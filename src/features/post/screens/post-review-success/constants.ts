import { PlaceReviewBadgeTier } from '@src/features/users-profile/services'
import { theme } from '@src/shared/constants/theme'
import { space } from '@src/shared/utils'

export type BadgeMilestone = {
  tier: PlaceReviewBadgeTier
  minReviews: number
  labelKey: string
}

export const BADGE_MILESTONES: BadgeMilestone[] = [
  { tier: 'regular', minReviews: 3, labelKey: 'post.badges.regular' },
  { tier: 'fan', minReviews: 5, labelKey: 'post.badges.fan' },
  { tier: 'frequent', minReviews: 10, labelKey: 'post.badges.frequent' },
  { tier: 'legend', minReviews: 15, labelKey: 'post.badges.legend' },
  { tier: 'king', minReviews: 20, labelKey: 'post.badges.king' }
]

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

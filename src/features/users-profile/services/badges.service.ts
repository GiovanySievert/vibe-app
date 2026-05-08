import { AxiosResponse } from 'axios'

import { coreApi } from '@src/services/api'

export type PlaceReviewBadgeTier = 'regular' | 'fan' | 'frequent' | 'legend' | 'king'

export type PlaceBadgeListItem = {
  placeId: string
  placeName: string | null
  brandAvatar: string | null
  reviewCount: number
  tiers: Array<{
    tier: PlaceReviewBadgeTier
    label: string
    achievedAt: string
  }>
}

export const BadgesService = {
  fetchUserBadges: (userId: string): Promise<AxiosResponse<PlaceBadgeListItem[]>> =>
    coreApi.get(`badges/user/${userId}`)
}

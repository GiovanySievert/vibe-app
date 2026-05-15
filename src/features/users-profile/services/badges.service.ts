import { AxiosResponse } from 'axios'

import { coreApi } from '@src/services/api'

export type PlaceReviewBadgeTier = 'regular' | 'fan' | 'frequent' | 'legend' | 'king'

export type PlaceBadgeListItem = {
  placeId: string
  placeName: string | null
  brandAvatar: string | null
  reviewCount: number
  visibleOnProfile: boolean
  profilePosition: number | null
  tiers: Array<{
    tier: PlaceReviewBadgeTier
    label: string
    achievedAt: string
  }>
}

export type PlaceBadgeProgressItem = {
  placeId: string
  placeName: string | null
  brandAvatar: string | null
  reviewCount: number
  targetReviewCount: number
  tier: PlaceReviewBadgeTier
  label: string
}

export type PlaceBadgeForPlace = {
  userId: string
  placeId: string
  reviewCount: number
  tiers: Array<{
    tier: PlaceReviewBadgeTier
    label: string
    achievedAt: string
  }>
}

export const MY_BADGES_QUERY_KEY = ['myBadges'] as const
export const MY_BADGE_PROGRESS_QUERY_KEY = ['myBadgeProgress'] as const
export const USER_BADGES_QUERY_KEY = ['userBadges'] as const

export const BadgesService = {
  fetchMyBadges: (): Promise<AxiosResponse<PlaceBadgeListItem[]>> => coreApi.get('badges/me'),
  fetchMyBadgeProgress: (): Promise<AxiosResponse<PlaceBadgeProgressItem[]>> => coreApi.get('badges/me/progress'),
  fetchUserBadges: (userId: string): Promise<AxiosResponse<PlaceBadgeListItem[]>> =>
    coreApi.get(`badges/user/${userId}`),
  fetchUserBadgeForPlace: (userId: string, placeId: string): Promise<AxiosResponse<PlaceBadgeForPlace>> =>
    coreApi.get(`badges/user/${userId}/place/${placeId}`),
  updateProfileBadgeSelection: (placeIds: string[]): Promise<AxiosResponse<{ placeIds: string[] }>> =>
    coreApi.put('badges/me/profile-selection', { placeIds })
}

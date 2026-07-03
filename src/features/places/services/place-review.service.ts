import { FeedReviewItem } from '@src/features/feed/domain/feed-review-item.model'
import type { StreakUpdateResponse } from '@src/features/users-profile/types'
import { coreApi } from '@src/services/api'

export type PlaceReviewEligibility = {
  canReview: boolean
  cooldown: {
    active: boolean
    lastReviewAt: string | null
    nextAllowedAt: string | null
    cooldownMinutes: number
  }
  reason: 'cooldown' | null
}

export type CreatePlaceReviewResponse = {
  streakUpdate: StreakUpdateResponse | null
}

export type PlaceReviewFriend = {
  id: string
  name: string
  username: string
  image: string | null
  latestReviewAt: string
}

export type PlaceReviewFriendsResponse = {
  data: PlaceReviewFriend[]
  total: number
  hasMore: boolean
  page: number
  limit: number
}

export const PlaceReviewService = {
  create: (payload: {
    placeId: string
    placeName: string
    rating: 'crowded' | 'dead'
    placeImageUrl: string
    placeImageThumbnailUrl?: string
    userLat: number
    userLng: number
    placeLat: number
    placeLng: number
    selfieUrl?: string
    selfieThumbnailUrl?: string
    selfieFriendsOnly?: boolean
    comment?: string
  }) => coreApi.post<CreatePlaceReviewResponse>('/place-reviews', payload),
  getFeed: (page?: number) => coreApi.get<FeedReviewItem[]>('/place-reviews/feed', { params: { page } }),
  listByPlace: (placeId: string) => coreApi.get<FeedReviewItem[]>(`/place-reviews/place/${placeId}`),
  listFriendsByPlace: (placeId: string, page?: number, limit?: number) =>
    coreApi.get<PlaceReviewFriendsResponse>(`/place-reviews/place/${placeId}/friends`, { params: { page, limit } }),
  listByUser: (userId: string, page?: number) =>
    coreApi.get<FeedReviewItem[]>(`/place-reviews/user/${userId}`, {
      params: { page }
    }),
  eligibility: (placeId: string) => coreApi.get<PlaceReviewEligibility>(`/place-reviews/place/${placeId}/eligibility`),
  listPopularByPlace: (placeId: string) => coreApi.get<FeedReviewItem[]>(`/place-reviews/place/${placeId}/popular`)
}

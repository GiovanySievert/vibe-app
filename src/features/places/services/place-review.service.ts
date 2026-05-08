import { FeedReviewItem } from '@src/features/feed/domain/feed-review-item.model'
import { coreApi } from '@src/services/api'

export const PlaceReviewService = {
  create: (payload: {
    placeId: string
    placeName: string
    rating: 'crowded' | 'dead'
    placeImageUrl?: string
    selfieUrl?: string
    selfieFriendsOnly?: boolean
    comment?: string
  }) =>
    coreApi.post('/place-reviews', payload),
  getFeed: (page?: number) =>
    coreApi.get<FeedReviewItem[]>('/place-reviews/feed', { params: { page } }),
  listByPlace: (placeId: string) =>
    coreApi.get<FeedReviewItem[]>(`/place-reviews/place/${placeId}`),
  listByUser: (userId: string, page?: number) =>
    coreApi.get<FeedReviewItem[]>(`/place-reviews/user/${userId}`, { params: { page } })
}

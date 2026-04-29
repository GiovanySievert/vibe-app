import { useQuery } from '@tanstack/react-query'

import { FeedReviewItem } from '@src/features/feed/domain/feed-review-item.model'
import { PlaceReviewService } from '@src/features/places/services/place-review.service'

export const useUserReviews = (userId: string) => {
  return useQuery<FeedReviewItem[], Error>({
    queryKey: ['userReviews', userId],
    queryFn: async () => {
      const response = await PlaceReviewService.listByUser(userId)
      return response.data
    },
    retry: false,
    staleTime: 0
  })
}

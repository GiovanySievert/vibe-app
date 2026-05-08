import { useQuery } from '@tanstack/react-query'

import { PlaceReviewService } from '../services/place-review.service'

export const usePlaceReviews = (placeId: string) =>
  useQuery({
    queryKey: ['placeReviews', placeId],
    queryFn: () => PlaceReviewService.listByPlace(placeId).then((r) => r.data),
    staleTime: 0,
    retry: false
  })

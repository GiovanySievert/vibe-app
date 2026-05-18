import { useQuery } from '@tanstack/react-query'

import { PlaceReviewService } from '../services/place-review.service'

export const usePlaceReviews = (placeId: string) =>
  useQuery({
    queryKey: ['placeReviews', placeId],
    queryFn: () => PlaceReviewService.listByPlace(placeId).then((r) => r.data),
    staleTime: 0,
    retry: false
  })

export const usePlacePopularReviews = (placeId: string, enabled: boolean) =>
  useQuery({
    queryKey: ['placePopularReviews', placeId],
    queryFn: () => PlaceReviewService.listPopularByPlace(placeId).then((r) => r.data),
    staleTime: 5 * 60 * 1000,
    retry: false,
    enabled
  })

export const usePlaceReviewFriends = (placeId: string) =>
  useQuery({
    queryKey: ['placeReviewFriends', placeId],
    queryFn: () => PlaceReviewService.listFriendsByPlace(placeId, 1, 10).then((r) => r.data),
    staleTime: 5 * 60 * 1000,
    retry: false,
    enabled: !!placeId
  })

import { coreApi } from '@src/services/api'

export const PlaceReviewService = {
  create: (payload: { placeId: string; rating: 'crowded' | 'dead'; imageUrl: string; comment?: string }) =>
    coreApi.post('/place-reviews', payload)
}

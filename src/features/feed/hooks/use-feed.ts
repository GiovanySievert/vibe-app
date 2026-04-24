import { useQuery } from '@tanstack/react-query'

import { FeedService } from '../services'

export const useFeed = (page?: number) => {
  return useQuery({
    queryKey: ['feed', page],
    queryFn: () => FeedService.list(page).then((r) => r.data),
    staleTime: 60_000
  })
}

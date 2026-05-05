import { useInfiniteQuery } from '@tanstack/react-query'

import { FeedService } from '../services'
import { FeedReviewItem } from '../domain/feed-review-item.model'

export const useFeed = () => {
  return useInfiniteQuery<FeedReviewItem[]>({
    queryKey: ['feed'],
    queryFn: ({ pageParam }) => FeedService.list(pageParam as number).then((r) => r.data),
    getNextPageParam: (lastPage, allPages) => lastPage.length > 0 ? allPages.length + 1 : undefined,
    initialPageParam: 1,
    staleTime: 60_000
  })
}

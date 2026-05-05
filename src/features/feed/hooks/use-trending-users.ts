import { useQuery } from '@tanstack/react-query'

import { UsersProfileService } from '@src/features/users-profile/services'

export const useTrendingUsers = () => {
  return useQuery({
    queryKey: ['trendingUsers'],
    queryFn: () => UsersProfileService.fetchTrending().then((response) => response.data),
    staleTime: 5 * 60_000
  })
}

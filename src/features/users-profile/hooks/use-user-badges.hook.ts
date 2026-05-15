import { useQuery } from '@tanstack/react-query'

import { BadgesService, PlaceBadgeListItem, USER_BADGES_QUERY_KEY } from '../services'

export const useUserBadges = (userId: string) => {
  return useQuery<PlaceBadgeListItem[], Error>({
    queryKey: [...USER_BADGES_QUERY_KEY, userId],
    queryFn: async () => (await BadgesService.fetchUserBadges(userId)).data,
    retry: false,
    staleTime: 60 * 5
  })
}

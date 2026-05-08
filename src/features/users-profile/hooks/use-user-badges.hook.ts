import { useQuery } from '@tanstack/react-query'

import { BadgesService, PlaceBadgeListItem } from '../services'

export const useUserBadges = (userId: string) => {
  return useQuery<PlaceBadgeListItem[], Error>({
    queryKey: ['userBadges', userId],
    queryFn: async () => (await BadgesService.fetchUserBadges(userId)).data,
    retry: false,
    staleTime: 60 * 5
  })
}

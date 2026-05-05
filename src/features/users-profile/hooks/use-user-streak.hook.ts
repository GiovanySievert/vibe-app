import { useQuery } from '@tanstack/react-query'

import { StreakService } from '../services'
import { UserStreakResponse } from '../types'

export const useUserStreak = (userId: string) => {
  return useQuery<UserStreakResponse, Error>({
    queryKey: ['userStreak', userId],
    queryFn: async () => (await StreakService.fetchUserStreak(userId)).data,
    retry: false,
    staleTime: 60 * 5
  })
}

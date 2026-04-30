import { useQuery } from '@tanstack/react-query'

import { NotificationInboxService } from '../services/notification-inbox.service'

export const useUnreadCount = () => {
  return useQuery<{ count: number }, Error>({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      const response = await NotificationInboxService.unreadCount()
      return response.data
    },
    refetchOnWindowFocus: true,
    refetchInterval: 60_000,
    staleTime: 30_000
  })
}

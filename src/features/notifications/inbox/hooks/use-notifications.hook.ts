import { useInfiniteQuery } from '@tanstack/react-query'

import {
  ListNotificationsResponse,
  NotificationInboxService
} from '../services/notification-inbox.service'

export const useNotifications = (options?: { enabled?: boolean }) => {
  return useInfiniteQuery<ListNotificationsResponse, Error>({
    queryKey: ['notifications', 'list'],
    queryFn: async ({ pageParam }) => {
      const response = await NotificationInboxService.list({
        limit: 20,
        cursor: pageParam as string | undefined
      })
      return response.data
    },
    initialPageParam: undefined,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    enabled: options?.enabled ?? true,
    staleTime: 0
  })
}

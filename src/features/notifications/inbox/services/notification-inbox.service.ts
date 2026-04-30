import { AxiosResponse } from 'axios'

import { coreApi } from '@src/services/api'

export type NotificationType = 'event_invitation' | 'follow_request_created'

export type NotificationItem = {
  id: string
  userId: string
  type: NotificationType
  title: string
  body: string
  data: Record<string, unknown> & { url?: string }
  readAt: string | null
  createdAt: string
}

export type ListNotificationsResponse = {
  items: NotificationItem[]
  nextCursor: string | null
}

export const NotificationInboxService = {
  list: (params?: {
    limit?: number
    cursor?: string
    unreadOnly?: boolean
  }): Promise<AxiosResponse<ListNotificationsResponse>> =>
    coreApi.get('/notifications', { params }),

  unreadCount: (): Promise<AxiosResponse<{ count: number }>> =>
    coreApi.get('/notifications/unread-count'),

  markAsRead: (id: string): Promise<AxiosResponse<{ ok: boolean }>> =>
    coreApi.post(`/notifications/${id}/read`),

  markAllAsRead: (): Promise<AxiosResponse<{ updated: number }>> =>
    coreApi.post('/notifications/read-all')
}

import { AxiosResponse } from 'axios'

import { coreApi } from '@src/services/api'

export type EventCommentResponse = {
  id: string
  eventId: string
  userId: string
  username: string
  avatar: string | null
  content: string
  createdAt: string
}

export type ListEventCommentsResponse = {
  data: EventCommentResponse[]
  total: number
  hasMore: boolean
}

export const EventCommentService = {
  list: (eventId: string, page: number): Promise<AxiosResponse<ListEventCommentsResponse>> =>
    coreApi.get(`/events/${eventId}/comments?page=${page}`),

  create: (eventId: string, content: string): Promise<AxiosResponse<EventCommentResponse>> =>
    coreApi.post(`/events/${eventId}/comments`, { content }),

  delete: (eventId: string, commentId: string): Promise<AxiosResponse<void>> =>
    coreApi.delete(`/events/${eventId}/comments/${commentId}`)
}

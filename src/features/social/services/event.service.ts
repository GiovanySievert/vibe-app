import { AxiosResponse } from 'axios'

import { coreApi } from '@src/services/api'

import { CreateEventPayload, EventParticipantStatus } from '../domain/event.model'

export type EventParticipantResponse = {
  id: string
  userId: string
  username: string
  avatar: string | null
  status: EventParticipantStatus
}

export type EventResponse = {
  id: string
  ownerId: string
  name: string
  date: string
  time: string
  description: string | null
  createdAt: string
  participants: EventParticipantResponse[]
}

export const EventService = {
  create: (payload: CreateEventPayload): Promise<AxiosResponse<EventResponse>> =>
    coreApi.post('/events', {
      name: payload.name,
      date: payload.date,
      time: payload.time,
      description: payload.description || undefined,
      participantIds: payload.participants.map((p) => p.id)
    }),

  listMyEvents: (): Promise<AxiosResponse<EventResponse[]>> => coreApi.get('/events'),

  listInvitations: (): Promise<AxiosResponse<EventResponse[]>> => coreApi.get('/events/invitations'),

  getById: (id: string): Promise<AxiosResponse<EventResponse>> => coreApi.get(`/events/${id}`),

  update: (id: string, payload: { description: string }): Promise<AxiosResponse<EventResponse>> =>
    coreApi.patch(`/events/${id}`, payload),

  respondToInvitation: (
    id: string,
    status: EventParticipantStatus.ACCEPTED | EventParticipantStatus.DECLINED
  ): Promise<AxiosResponse<EventResponse>> => coreApi.post(`/events/${id}/respond`, { status })
}

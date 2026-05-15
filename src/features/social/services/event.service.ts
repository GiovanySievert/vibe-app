import { AxiosResponse } from 'axios'

import { coreApi } from '@src/services/api'

import { CreateEventRequest, EventParticipantStatus, EventPlaceSummary } from '../domain/event.model'

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
  place: EventPlaceSummary | null
  imageUrl: string | null
  createdAt: string
  participants: EventParticipantResponse[]
}

export const EventService = {
  create: (payload: CreateEventRequest): Promise<AxiosResponse<EventResponse>> =>
    coreApi.post('/events', {
      name: payload.name,
      date: payload.date,
      time: payload.time,
      description: payload.description || undefined,
      placeId: payload.place?.id || undefined,
      imageUrl: payload.imageUrl,
      participantIds: payload.participants.map((p) => p.id)
    }),

  listMyEvents: (): Promise<AxiosResponse<EventResponse[]>> => coreApi.get('/events'),

  listInvitations: (): Promise<AxiosResponse<EventResponse[]>> => coreApi.get('/events/invitations'),

  getById: (id: string): Promise<AxiosResponse<EventResponse>> => coreApi.get(`/events/${id}`),

  update: (
    id: string,
    payload: { description: string; placeId: string | null; imageUrl: string | null }
  ): Promise<AxiosResponse<EventResponse>> =>
    coreApi.patch(`/events/${id}`, payload),

  respondToInvitation: (
    id: string,
    status: EventParticipantStatus.ACCEPTED | EventParticipantStatus.DECLINED
  ): Promise<AxiosResponse<EventResponse>> => coreApi.post(`/events/${id}/respond`, { status }),

  delete: (id: string): Promise<AxiosResponse<void>> => coreApi.delete(`/events/${id}`)
}

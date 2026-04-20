import { GetUserByUsername } from '@src/shared/domain/users.model'

export enum EventParticipantStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined'
}

export type EventFormData = {
  name: string
  date: string
  time: string
  description: string
}

export type CreateEventPayload = EventFormData & {
  participants: GetUserByUsername[]
}

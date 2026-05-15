import { GetUserByUsername } from '@src/shared/domain/users.model'

export enum EventParticipantStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined'
}

export type EventPlaceSummary = {
  id: string
  name: string
  type: string | null
  neighborhood: string | null
}

export type EventFormData = {
  name: string
  date: string
  time: string
  description: string
  place: EventPlaceSummary | null
  imageUri: string | null
}

export type CreateEventPayload = EventFormData & {
  participants: GetUserByUsername[]
}

export type CreateEventRequest = Omit<CreateEventPayload, 'imageUri'> & {
  imageUrl?: string
}

import { atom } from 'jotai'

import { EventPlaceSummary } from '../domain/event.model'

export const eventPlacePickerAtom = atom<EventPlaceSummary | null>(null)

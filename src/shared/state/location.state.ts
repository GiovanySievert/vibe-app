import { atom } from 'jotai'

import { LocationModel } from '../domain'

export const locationStateAtom = atom<LocationModel>({
  latitude: 0,
  longitude: 0
})

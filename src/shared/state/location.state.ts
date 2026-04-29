import { atom } from 'jotai'

import { LocationModel } from '../domain'

export const locationStateAtom = atom<LocationModel | null>(null)

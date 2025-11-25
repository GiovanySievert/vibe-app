import { atom } from 'jotai'

import { UserFavoritePlace } from '../domain'

export const userFavoritesPlacesAtom = atom<UserFavoritePlace[]>([])

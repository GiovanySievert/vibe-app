import { useQuery } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

import { UserFavoritesPlacesService } from '@src/features/user-favorites-places/services'

interface UserFavoritePlace {
  id: string
  userId: string
  venueId: string
  name: string
  avatar: string
  createdAt: string
}

export const userFavoritesPlacesAtom = atomWithStorage<UserFavoritePlace[]>('userFavoritesPlaces', [])

export const useUserFavoritesPlaces = () => {
  const setFavoritePlaces = useSetAtom(userFavoritesPlacesAtom)

  return useQuery<UserFavoritePlace[], Error>({
    queryKey: ['fetchUserFavoritesPlaces'],
    queryFn: async () => {
      const response = await UserFavoritesPlacesService.fetchAllPlaces()
      setFavoritePlaces(response.data)
      return response.data
    },
    retry: false,
    staleTime: 0
  })
}

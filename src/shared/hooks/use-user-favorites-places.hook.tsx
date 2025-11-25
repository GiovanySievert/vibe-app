import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'

import { UserFavoritesPlacesService } from '@src/features/user-favorites-places/services'

import { UserFavoritePlace } from '../domain'
import { userFavoritesPlacesAtom } from '../state'

export const useUserFavoritesPlaces = () => {
  const setFavoritePlaces = useSetAtom(userFavoritesPlacesAtom)
  const queryClient = useQueryClient()

  const query = useQuery<UserFavoritePlace[], Error>({
    queryKey: ['fetchUserFavoritesPlaces'],
    queryFn: async () => {
      const response = await UserFavoritesPlacesService.fetchAllPlaces()
      setFavoritePlaces(response.data)
      return response.data
    },
    retry: false,
    staleTime: 1000 * 60 * 5
  })

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: ['fetchUserFavoritesPlaces']
    })
  }

  const refetch = () => {
    query.refetch()
  }

  const isInvalid = queryClient.getQueryState(['fetchUserFavoritesPlaces'])?.isInvalidated

  return {
    ...query,
    invalidate,
    refetch,
    isInvalid
  }
}

import { AxiosResponse } from 'axios'

import { coreApi } from '@src/services/api'
import { UserFavoritePlace } from '@src/shared/domain'

export const UserFavoritesPlacesService = {
  fetchAllPlaces: async (): Promise<AxiosResponse<any>> => await coreApi.get(`/user-favorites-places`),
  favoritePlace: async (placeId: number): Promise<AxiosResponse<UserFavoritePlace>> =>
    await coreApi.post(`/user-favorites-places/${placeId}`),
  unfavoritePlace: async (placeId: number): Promise<AxiosResponse<void>> =>
    await coreApi.delete(`/user-favorites-places/${placeId}`)
}

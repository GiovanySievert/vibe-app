import { AxiosResponse } from 'axios'

import { coreApi } from '@src/services/api'
import { CreatedUserFavoritePlace, UserFavoritePlace } from '@src/shared/domain'

export const UserFavoritesPlacesService = {
  fetchAllPlaces: async (): Promise<AxiosResponse<UserFavoritePlace[]>> => await coreApi.get(`/user-favorites-places`),
  favoritePlace: async (placeId: string): Promise<AxiosResponse<CreatedUserFavoritePlace>> =>
    await coreApi.post(`/user-favorites-places/${placeId}`),
  unfavoritePlace: async (placeId: string): Promise<AxiosResponse<void>> =>
    await coreApi.delete(`/user-favorites-places/${placeId}`)
}

import { AxiosResponse } from 'axios'

import { coreApi } from '@src/services/api'

export const UserFavoritesPlacesService = {
  fetchAllPlaces: async (): Promise<AxiosResponse<any>> => await coreApi.get(`/user-favorites-places`)
}

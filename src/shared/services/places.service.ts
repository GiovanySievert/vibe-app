import { AxiosResponse } from 'axios'

import { coreApi, placesApi } from '@src/services/api'

import { PlacesRequestParamsDTO, PlacesResponseBodyDTO } from '../domain'

export const PlacesService = {
  fetchPlacesNearMe: (data: PlacesRequestParamsDTO): Promise<AxiosResponse<PlacesResponseBodyDTO>> =>
    placesApi.get(`/nearby?lat=${data.lat}&lon=${data.lon}&radius=${data.radius}`),
  fetchPlaceById: (placeId: string): Promise<AxiosResponse<PlacesResponseBodyDTO>> => coreApi.get(`/venues/1`)
}

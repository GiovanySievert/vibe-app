import { AxiosResponse } from 'axios'

import { coreApi, placesApi } from '@src/services/api'

import { PlacesByIdResponse, PlacesRequestParamsDTO, PlacesResponseBodyDTO } from '../domain'

export const PlacesService = {
  fetchPlacesNearMe: (data: PlacesRequestParamsDTO): Promise<AxiosResponse<PlacesResponseBodyDTO>> =>
    placesApi.get(`/nearby?lat=${data.lat}&lon=${data.lon}&radius=${data.radius}`),
  fetchPlaceById: (placeId: string): Promise<AxiosResponse<PlacesByIdResponse>> => coreApi.get(`/venues/1`)
}

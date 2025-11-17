import { AxiosResponse } from 'axios'

import { coreApi, placesApi } from '@src/services/api'

import { PlacesByIdResponse, PlacesModel, PlacesRequestParamsDTO } from '../domain'

export const PlacesService = {
  fetchPlacesNearMe: (data: PlacesRequestParamsDTO): Promise<AxiosResponse<PlacesModel[]>> =>
    placesApi.get(`/nearby?lat=${data.lat}&lon=${data.lon}&radius=${data.radius}`),
  fetchPlaceById: (placeId: string): Promise<AxiosResponse<PlacesByIdResponse>> => coreApi.get(`/venues/${placeId}`),
  fetchPlaceByName: (search: string): Promise<AxiosResponse<PlacesByIdResponse>> =>
    placesApi.get(`/nearby?name=${search}`)
}

import { AxiosResponse } from 'axios'

import { HotPlaceItem } from '@src/features/search/domain'
import { coreApi, placesApi } from '@src/services/api'

import { PlacesByIdResponse, PlacesModel, PlacesRequestParamsDTO } from '../domain'

export const PlacesService = {
  fetchPlacesNearMe: (data: PlacesRequestParamsDTO): Promise<AxiosResponse<PlacesModel[]>> =>
    placesApi.get(`/nearby?lat=${data.lat}&lon=${data.lon}&radius=${data.radius}`),
  fetchPlaceById: (placeId: string): Promise<AxiosResponse<PlacesByIdResponse>> => coreApi.get(`/places/${placeId}`),
  fetchPlaceByName: (search: string): Promise<AxiosResponse<PlacesModel[]>> => placesApi.get(`/search?query=${search}`),
  fetchHotPlaces: (params?: { lat: number; lon: number }): Promise<AxiosResponse<HotPlaceItem[]>> => {
    const query = params ? `&lat=${params.lat}&lon=${params.lon}` : ''
    return placesApi.get(`places/hot?size=10${query}`)
  }
}

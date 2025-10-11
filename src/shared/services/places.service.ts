import { AxiosResponse } from 'axios'

import { placesApi } from '@src/services/api'

import { PlacesRequestParamsDTO, PlacesResponseBodyDTO } from '../domain'

export const PlacesService = {
  fetchPlaces: (data: PlacesRequestParamsDTO): Promise<AxiosResponse<PlacesResponseBodyDTO>> =>
    placesApi.get(`/nearby?lat=${data.lat}&lon=${data.lon}&radius=${data.radius}`)
}

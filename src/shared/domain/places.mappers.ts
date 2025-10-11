import { PlacesModel } from './places.model'

export type PlacesRequestParamsDTO = {
  lat: number
  lon: number
  radius: string
}

export type PlacesResponseBodyDTO = {
  items: PlacesModel[]
}

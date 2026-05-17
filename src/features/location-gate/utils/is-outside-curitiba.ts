import { LocationModel } from '@src/shared/domain'
import { haversineMeters } from '@src/shared/utils/haversine'

import { CURITIBA_COORDS, CURITIBA_RADIUS_METERS } from './curitiba'

export const isOutsideCuritiba = (location: LocationModel): boolean => {
  const distance = haversineMeters(
    { lat: location.latitude, lng: location.longitude },
    CURITIBA_COORDS
  )
  return distance > CURITIBA_RADIUS_METERS
}

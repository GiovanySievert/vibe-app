import { useMemo } from 'react'

import { useAtomValue } from 'jotai'

import { PLACE_REVIEW_MAX_DISTANCE_M } from '@src/shared/constants/app-config'
import { locationStateAtom } from '@src/shared/state/location.state'
import { haversineMeters } from '@src/shared/utils'

type PlaceCoords = { lat: number | string; lng: number | string }

export type DistanceToPlaceResult = {
  distanceMeters: number | null
  withinRange: boolean | null
  hasLocation: boolean
  userLat: number | null
  userLng: number | null
}

export const useDistanceToPlace = (place: PlaceCoords | null | undefined): DistanceToPlaceResult => {
  const userLocation = useAtomValue(locationStateAtom)

  return useMemo(() => {
    if (!userLocation) {
      return {
        distanceMeters: null,
        withinRange: null,
        hasLocation: false,
        userLat: null,
        userLng: null
      }
    }

    if (!place) {
      return {
        distanceMeters: null,
        withinRange: null,
        hasLocation: true,
        userLat: userLocation.latitude,
        userLng: userLocation.longitude
      }
    }

    const placeLat = typeof place.lat === 'string' ? Number(place.lat) : place.lat
    const placeLng = typeof place.lng === 'string' ? Number(place.lng) : place.lng

    if (Number.isNaN(placeLat) || Number.isNaN(placeLng)) {
      return {
        distanceMeters: null,
        withinRange: null,
        hasLocation: true,
        userLat: userLocation.latitude,
        userLng: userLocation.longitude
      }
    }

    const distance = haversineMeters(
      { lat: userLocation.latitude, lng: userLocation.longitude },
      { lat: placeLat, lng: placeLng }
    )

    return {
      distanceMeters: Math.round(distance),
      withinRange: distance <= PLACE_REVIEW_MAX_DISTANCE_M,
      hasLocation: true,
      userLat: userLocation.latitude,
      userLng: userLocation.longitude
    }
  }, [userLocation, place])
}

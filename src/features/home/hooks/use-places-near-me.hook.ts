import { useRef, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'

import { PlacesModel } from '@src/shared/domain'
import { PlacesService } from '@src/shared/services'
import { locationStateAtom } from '@src/shared/state/location.state'

type Coords = { latitude: number; longitude: number }

export const usePlacesNearMe = () => {
  const [locationState] = useAtom(locationStateAtom)
  const [searchCoords, setSearchCoords] = useState<Coords | null>(null)
  const accumulatedPlaces = useRef<PlacesModel[]>([])

  const coords = searchCoords ?? locationState

  const { data: fetchedPlaces, isFetching } = useQuery<PlacesModel[], Error>({
    queryKey: ['fetchPlaces', coords?.latitude, coords?.longitude],
    queryFn: async () => {
      if (!coords) throw new Error('location not ready')
      const response = await PlacesService.fetchPlacesNearMe({
        lat: coords.latitude,
        lon: coords.longitude,
        radius: '1km'
      })
      return response.data
    },
    retry: false,
    staleTime: 0,
    enabled: !!coords
  })

  if (fetchedPlaces) {
    const existingIds = new Set(accumulatedPlaces.current.map((p) => p.id))
    const newOnes = fetchedPlaces.filter((p) => !existingIds.has(p.id))
    if (newOnes.length > 0) accumulatedPlaces.current = [...accumulatedPlaces.current, ...newOnes]
  }

  const places = accumulatedPlaces.current.length > 0 ? accumulatedPlaces.current : (fetchedPlaces ?? [])

  return { places, isFetching, setSearchCoords }
}

import { useEffect, useRef, useState } from 'react'

import * as Location from 'expo-location'
import { useSetAtom } from 'jotai'

import { locationStateAtom } from '@src/shared/state/location.state'

export function useUserLocation() {
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const setLocation = useSetAtom(locationStateAtom)
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true

    const getUserLocation = async () => {
      if (!isMountedRef.current) return
      setLoading(true)
      try {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (!isMountedRef.current) return
        if (status !== 'granted') {
          setErrorMsg('Permissão negada')
          setLoading(false)
          return
        }

        const last = await Location.getLastKnownPositionAsync()
        if (!isMountedRef.current) return
        if (last) {
          setLocation({
            latitude: last.coords.latitude,
            longitude: last.coords.longitude,
            neighborhood: null
          })
        }

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High
        })
        if (!isMountedRef.current) return

        const [place] = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude
        })
        if (!isMountedRef.current) return

        const neighborhood = place?.district ?? place?.subregion ?? place?.city ?? null

        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          neighborhood
        })
      } catch {
        if (!isMountedRef.current) return
        setErrorMsg('Não foi possível obter a localização')
      } finally {
        if (isMountedRef.current) setLoading(false)
      }
    }

    getUserLocation()

    return () => {
      isMountedRef.current = false
    }
  }, [setLocation])

  return { loading, errorMsg }
}

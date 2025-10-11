import { useEffect, useState } from 'react'

import * as Location from 'expo-location'
import { useSetAtom } from 'jotai'

import { locationStateAtom } from '@src/shared/state/location.state'

export function useUserLocation() {
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const setLocation = useSetAtom(locationStateAtom)

  useEffect(() => {
    const getUserLocation = async () => {
      setLoading(true)
      try {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
          setErrorMsg('Permissão negada')
          setLoading(false)
          return
        }

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High
        })

        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude
        })
      } catch (error) {
        console.error('todo -- add logger', error)
      } finally {
        setLoading(false)
      }
    }
    getUserLocation()
  }, [setLocation])

  return { loading, errorMsg }
}

import React from 'react'
import { StyleSheet } from 'react-native'

import { useQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'

import { authStateAtom } from '@src/features/auth/state'
import { Box, ThemedText } from '@src/shared/components'
import { Input } from '@src/shared/components/input'
import { MapWithPins } from '@src/shared/components/map'
import { Screen } from '@src/shared/components/screen'
import { PlacesModel } from '@src/shared/domain'
import { PlacesService } from '@src/shared/services'
import { locationStateAtom } from '@src/shared/state/location.state'

export const HomeScreen = () => {
  const [authState] = useAtom(authStateAtom)
  const [locationState] = useAtom(locationStateAtom)

  const fetchPlaces = async () => {
    const response = await PlacesService.fetchPlaces({
      lat: locationState.latitude,
      lon: locationState.longitude,
      radius: '2km'
    })
    return response.data.items
  }

  const { data, isPending } = useQuery<PlacesModel[], Error>({
    queryKey: ['fetchPlaces'],
    queryFn: fetchPlaces,
    retry: false,
    staleTime: 0,
    enabled: !!locationState
  })

  if (isPending || !data?.length) {
    return
  }
  return (
    <Screen>
      <Box pl={6} pr={6}>
        <ThemedText type="link">Hello {authState.user?.name}</ThemedText>
        <Input placeholder="Procure lugares aqui" />
      </Box>
      <Box style={styles.card}>{<MapWithPins points={data} onPressPin={(p) => console.log('clicou', p)} />}</Box>
    </Screen>
  )
}

const styles = StyleSheet.create({
  card: {
    marginTop: 32,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden'
  },
  map: { height: '100%', width: '100%' }
})

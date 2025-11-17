import React from 'react'
import { StyleSheet } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { useQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'

import { AuthenticatedStackParamList } from '@src/app/navigation/types'
import { authStateAtom } from '@src/features/auth/state'
import { Box, FakeInput, ThemedText } from '@src/shared/components'
import { MapWithPins } from '@src/shared/components/map'
import { Screen } from '@src/shared/components/screen'
import { PlacesModel } from '@src/shared/domain'
import { PlacesService } from '@src/shared/services'
import { locationStateAtom } from '@src/shared/state/location.state'

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<AuthenticatedStackParamList>>()

  const [authState] = useAtom(authStateAtom)
  const [locationState] = useAtom(locationStateAtom)

  const fetchPlaces = async () => {
    const response = await PlacesService.fetchPlacesNearMe({
      lat: locationState.latitude,
      lon: locationState.longitude,
      radius: '2km'
    })

    return response.data
  }
  const { data, isPending } = useQuery<PlacesModel[], Error>({
    queryKey: ['fetchPlaces'],
    queryFn: fetchPlaces,
    retry: false,
    staleTime: 0,
    enabled: !!locationState
  })

  if (isPending) {
    return
  }

  return (
    <Screen>
      <Box pl={6} pr={6} gap={3}>
        <ThemedText>Hello {authState.user?.name}</ThemedText>
        <FakeInput
          placeholder="Procure lugares aqui"
          onPress={() => navigation.navigate('Modals', { screen: 'SearchScreen' })}
        />
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

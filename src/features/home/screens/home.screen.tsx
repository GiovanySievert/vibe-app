import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { useQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { Search } from 'lucide-react-native'

import { AuthenticatedStackParamList } from '@src/app/navigation/types'
import { Box, ThemedText } from '@src/shared/components'
import { MapWithPins } from '@src/shared/components/map'
import { Screen } from '@src/shared/components/screen'
import { theme } from '@src/shared/constants/theme'
import { PlacesModel } from '@src/shared/domain'
import { PlacesService } from '@src/shared/services'
import { locationStateAtom } from '@src/shared/state/location.state'

import { NearbyPlacesScroll } from '../components'

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<AuthenticatedStackParamList>>()
  const [locationState] = useAtom(locationStateAtom)

  const fetchPlaces = async () => {
    if (!locationState) throw new Error('location not ready')
    const response = await PlacesService.fetchPlacesNearMe({
      lat: locationState.latitude,
      lon: locationState.longitude,
      radius: '2km'
    })
    return response.data
  }

  const { data: placesData } = useQuery<PlacesModel[], Error>({
    queryKey: ['fetchPlaces', locationState?.latitude, locationState?.longitude],
    queryFn: fetchPlaces,
    retry: false,
    staleTime: 0,
    enabled: !!locationState
  })

  return (
    <Screen gradient>
      <Box pl={4} pr={4} pt={5} pb={2} flexDirection="row" alignItems="center" justifyContent="space-between">
        <Box>
          <ThemedText variant="title">agora</ThemedText>
          <ThemedText variant="mono" style={styles.subtitle}>
            vila madalena · últimos 60 minutos
          </ThemedText>
        </Box>
        <TouchableOpacity
          onPress={() => navigation.navigate('Modals', { screen: 'SearchScreen' })}
          style={styles.searchButton}
        >
          <Search size={20} color={theme.colors.textPrimary} strokeWidth={1.5} />
        </TouchableOpacity>
      </Box>

      <Box pl={4} pr={4} style={styles.mapContainer}>
        <MapWithPins points={placesData} onPressPin={(p) => console.log('clicou', p)} />
      </Box>

      {!!placesData?.length && <NearbyPlacesScroll places={placesData} />}
    </Screen>
  )
}

const styles = StyleSheet.create({
  subtitle: { marginTop: 4 },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: theme.colors.border
  },
  mapContainer: {
    flex: 1,

    overflow: 'hidden'
  }
})

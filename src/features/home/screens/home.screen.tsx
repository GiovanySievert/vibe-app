import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { Search } from 'lucide-react-native'

import { AuthenticatedStackParamList } from '@src/app/navigation/types'
import { Box, ThemedText } from '@src/shared/components'
import { MapWithPins } from '@src/shared/components/map'
import { Screen } from '@src/shared/components/screen'
import { theme } from '@src/shared/constants/theme'

import { NearbyPlacesScroll } from '../components'
import { usePlacesNearMe } from '../hooks/use-places-near-me.hook'

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<AuthenticatedStackParamList>>()
  const { places, isFetching, setSearchCoords } = usePlacesNearMe()

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
        <MapWithPins points={places} isSearching={isFetching} onPressPin={(p) => console.log('clicou', p)} onRegionMoved={setSearchCoords} />
      </Box>

      {!!places.length && <NearbyPlacesScroll places={places} />}
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
    borderColor: theme.colors.border,
  },
  mapContainer: {
    flex: 1,
    overflow: 'hidden',
  },
})

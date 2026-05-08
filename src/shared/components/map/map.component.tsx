import React, { useRef, useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import MapboxGL from '@rnmapbox/maps'
import { useAtom } from 'jotai'

import { theme } from '@src/shared/constants/theme'
import { PlacesModel } from '@src/shared/domain'
import { locationStateAtom } from '@src/shared/state/location.state'
import { calculateDistance } from '@src/shared/utils'

import { Box } from '../box'
import { MapPin } from '../map-pin'
import { ThemedText } from '../themed-text'
import { vibesMapStyle } from './map.style'
import { UserLocationPin } from './user-location-pin.component'

MapboxGL.setAccessToken('')

type Coords = { latitude: number; longitude: number }

type MapWithPinsProps = {
  points?: PlacesModel[]
  isSearching?: boolean
  onPressPin?: (point: PlacesModel) => void
  onRegionMoved?: (coords: Coords) => void
}

const THRESHOLD_KM = 1

export const MapWithPins: React.FC<MapWithPinsProps> = ({ points, isSearching, onPressPin, onRegionMoved }) => {
  const [locationState] = useAtom(locationStateAtom)
  const lastSearchCoords = useRef<Coords>({ latitude: locationState!.latitude, longitude: locationState!.longitude })
  const [showSearchButton, setShowSearchButton] = useState(false)
  const pendingCenter = useRef<Coords | null>(null)

  const handleCameraChanged = (
    state: Parameters<NonNullable<React.ComponentProps<typeof MapboxGL.MapView>['onCameraChanged']>>[0]
  ) => {
    const [lon, lat] = state.properties.center
    pendingCenter.current = { latitude: lat, longitude: lon }
    const dist = calculateDistance(lastSearchCoords.current.latitude, lastSearchCoords.current.longitude, lat, lon)
    setShowSearchButton(dist >= THRESHOLD_KM)
  }

  const handleSearchHere = () => {
    if (!pendingCenter.current) return
    lastSearchCoords.current = pendingCenter.current
    setShowSearchButton(false)
    onRegionMoved?.(pendingCenter.current)
  }

  return (
    <View style={styles.container}>
      <MapboxGL.MapView style={styles.map} styleJSON={vibesMapStyle} onCameraChanged={handleCameraChanged}>
        <MapboxGL.Camera
          centerCoordinate={[locationState!.longitude, locationState!.latitude]}
          zoomLevel={14}
          animationDuration={0}
          animationMode="none"
        />

        {points
          ?.slice()
          .sort((a, b) => b.location.lat - a.location.lat)
          .map((p) => (
            <MapPin
              key={p.id}
              placeId={p.id}
              placeName={p.name}
              placeIsHot={!!p.isHot}
              coordinate={[p.location.lon, p.location.lat]}
              onPress={() => onPressPin?.(p)}
            />
          ))}

        <UserLocationPin coordinate={[locationState!.longitude, locationState!.latitude]} />
      </MapboxGL.MapView>

      {(showSearchButton || isSearching) && (
        <Box style={styles.searchButtonContainer}>
          <TouchableOpacity style={styles.searchButton} onPress={handleSearchHere} disabled={isSearching}>
            <ThemedText size="xs" weight="semibold">
              {isSearching ? 'Carregando...' : 'Buscar nesta área'}
            </ThemedText>
          </TouchableOpacity>
        </Box>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 0.3,
    borderColor: theme.colors.textTerciary
  },
  map: { flex: 1 },
  searchButtonContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: 'center'
  },
  searchButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: theme.colors.backgroundSecondary,
    borderWidth: 0.5,
    borderColor: theme.colors.border
  }
})

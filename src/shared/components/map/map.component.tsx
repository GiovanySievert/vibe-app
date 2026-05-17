import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import MapboxGL from '@rnmapbox/maps'
import { useAtomValue } from 'jotai'
import { LocateFixed } from 'lucide-react-native'

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
  onRegionMoved?: (coords: Coords) => void
}

const THRESHOLD_KM = 1
const TELEPORT_THRESHOLD_KM = 20

export const MapWithPins: React.FC<MapWithPinsProps> = ({ points, isSearching, onRegionMoved }) => {
  const locationState = useAtomValue(locationStateAtom)
  const initialCenter = useRef<Coords | null>(null)
  const lastSearchCoords = useRef<Coords | null>(null)
  const pendingCenter = useRef<Coords | null>(null)
  const cameraRef = useRef<MapboxGL.Camera>(null)
  const [showSearchButton, setShowSearchButton] = useState(false)

  if (initialCenter.current === null && locationState) {
    initialCenter.current = locationState
    lastSearchCoords.current = locationState
  }

  const sortedPoints = useMemo(() => points?.slice().sort((a, b) => b.location.lat - a.location.lat), [points])

  const userCoord = useMemo<[number, number] | null>(
    () => (locationState ? [locationState.longitude, locationState.latitude] : null),
    [locationState?.longitude, locationState?.latitude]
  )

  useEffect(() => {
    if (!locationState) return
    const ref = pendingCenter.current ?? initialCenter.current
    if (!ref) return
    const dist = calculateDistance(ref.latitude, ref.longitude, locationState.latitude, locationState.longitude)
    if (dist < TELEPORT_THRESHOLD_KM) return
    cameraRef.current?.setCamera({
      centerCoordinate: [locationState.longitude, locationState.latitude],
      zoomLevel: 14,
      animationDuration: 600
    })
    lastSearchCoords.current = locationState
    pendingCenter.current = locationState
    setShowSearchButton(false)
  }, [locationState?.latitude, locationState?.longitude])

  const handleCameraChanged = useCallback(
    (state: Parameters<NonNullable<React.ComponentProps<typeof MapboxGL.MapView>['onCameraChanged']>>[0]) => {
      const [lon, lat] = state.properties.center
      pendingCenter.current = { latitude: lat, longitude: lon }
      const ref = lastSearchCoords.current
      if (!ref) return
      const dist = calculateDistance(ref.latitude, ref.longitude, lat, lon)
      const next = dist >= THRESHOLD_KM
      setShowSearchButton((prev) => (prev === next ? prev : next))
    },
    []
  )

  const handleSearchHere = useCallback(() => {
    if (!pendingCenter.current) return
    lastSearchCoords.current = pendingCenter.current
    setShowSearchButton(false)
    onRegionMoved?.(pendingCenter.current)
  }, [onRegionMoved])

  const handleRecenter = useCallback(() => {
    if (!locationState) return
    cameraRef.current?.setCamera({
      centerCoordinate: [locationState.longitude, locationState.latitude],
      zoomLevel: 14,
      animationDuration: 400
    })
    lastSearchCoords.current = locationState
    pendingCenter.current = locationState
    setShowSearchButton(false)
  }, [locationState?.longitude, locationState?.latitude])

  if (!initialCenter.current) {
    return <View style={styles.container} />
  }

  return (
    <View style={styles.container}>
      <MapboxGL.MapView style={styles.map} styleJSON={vibesMapStyle} onCameraChanged={handleCameraChanged}>
        <MapboxGL.Camera
          ref={cameraRef}
          defaultSettings={{
            centerCoordinate: [initialCenter.current.longitude, initialCenter.current.latitude],
            zoomLevel: 14
          }}
        />

        {sortedPoints?.map((p) => (
          <MapPin
            key={p.id}
            placeId={p.id}
            placeName={p.name}
            placeIsHot={!!p.isHot}
            coordinate={[p.location.lon, p.location.lat]}
          />
        ))}

        {userCoord && <UserLocationPin coordinate={userCoord} />}
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

      {locationState && (
        <TouchableOpacity
          style={styles.recenterButton}
          onPress={handleRecenter}
          accessibilityRole="button"
          accessibilityLabel="Centrar no meu local"
        >
          <LocateFixed size={20} color={theme.colors.textPrimary} strokeWidth={1.5} />
        </TouchableOpacity>
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
  },
  recenterButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: theme.colors.border
  }
})

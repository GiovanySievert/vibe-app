import React, { useRef, useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import MapboxGL from '@rnmapbox/maps'
import { useAtom } from 'jotai'

import { theme } from '@src/shared/constants/theme'
import { PlacesModel } from '@src/shared/domain'
import { locationStateAtom } from '@src/shared/state/location.state'
import { calculateDistance } from '@src/shared/utils'

import { MapPin } from '../map-pin'
import { ThemedText } from '../themed-text'
import { vibesMapStyle } from './map.style'

MapboxGL.setAccessToken('')

type Coords = { latitude: number; longitude: number }

type MapWithPinsProps = {
  points?: PlacesModel[]
  onPressPin?: (point: PlacesModel) => void
  onRegionMoved?: (coords: Coords) => void
}

const THRESHOLD_KM = 1

export const MapWithPins: React.FC<MapWithPinsProps> = ({ points, onPressPin, onRegionMoved }) => {
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
            <MapboxGL.MarkerView
              key={p.id}
              id={p.id}
              coordinate={[p.location.lon, p.location.lat]}
              allowOverlap={true}
              anchor={{ x: 0.5, y: 1.0 }}
            >
              <MapPin placeName={p.name} placeId={p.id} placeIsHot={!!p.isHot} onPress={() => onPressPin?.(p)} />
            </MapboxGL.MarkerView>
          ))}

        <MapboxGL.MarkerView
          id="user-location"
          coordinate={[locationState!.longitude, locationState!.latitude]}
          allowOverlap={true}
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <View style={styles.userDotOuter}>
            <View style={styles.userDotInner} />
          </View>
        </MapboxGL.MarkerView>
      </MapboxGL.MapView>

      {showSearchButton && (
        <View style={styles.searchButtonContainer}>
          <TouchableOpacity style={styles.searchButton} onPress={handleSearchHere}>
            <ThemedText style={styles.searchButtonText}>Buscar nesta área</ThemedText>
          </TouchableOpacity>
        </View>
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
  userDotOuter: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: theme.colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  userDotInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.textPrimary,
    borderWidth: 2.5,
    borderColor: theme.colors.background
  },
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
  searchButtonText: {
    fontSize: 13,
    fontFamily: 'InterTight-SemiBold'
  }
})

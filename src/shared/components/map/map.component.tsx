import React, { useEffect, useMemo, useRef } from 'react'
import { StyleSheet, View } from 'react-native'

import MapboxGL from '@rnmapbox/maps'
import { useAtom } from 'jotai'

import { PlacesModel } from '@src/shared/domain'
import { locationStateAtom } from '@src/shared/state/location.state'

import { MapPin } from '../map-pin'

MapboxGL.setAccessToken('')

type MapWithPinsProps = {
  points?: PlacesModel[]
  style?: any
  onPressPin?: (point: PlacesModel) => void
}
export const MapWithPins: React.FC<MapWithPinsProps> = ({ points, onPressPin }) => {
  const cameraRef = useRef<MapboxGL.Camera>(null)
  const [locationState] = useAtom(locationStateAtom)

  const bounds = useMemo(() => {
    if (!points?.length) return null
    let minLat = +Infinity,
      maxLat = -Infinity,
      minLon = +Infinity,
      maxLon = -Infinity
    for (const p of points) {
      if (p.location.lat < minLat) minLat = p.location.lat
      if (p.location.lat > maxLat) maxLat = p.location.lat
      if (p.location.lon < minLon) minLon = p.location.lon
      if (p.location.lon > maxLon) maxLon = p.location.lon
    }
    return { minLat, maxLat, minLon, maxLon }
  }, [points])

  useEffect(() => {
    if (bounds && cameraRef.current) {
      cameraRef.current.fitBounds([bounds.minLon, bounds.minLat], [bounds.maxLon, bounds.maxLat], 50, 500)
    }
  }, [bounds])

  return (
    <View style={styles.container}>
      <MapboxGL.MapView style={styles.map} styleURL={MapboxGL.StyleURL.Dark}>
        {locationState && (
          <MapboxGL.Camera
            animationDuration={0}
            animationMode="none"
            centerCoordinate={[locationState.longitude, locationState.latitude]}
            ref={cameraRef}
            zoomLevel={14}
          />
        )}

        {points?.map((p) => (
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
      </MapboxGL.MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden'
  },
  map: { flex: 1 }
})

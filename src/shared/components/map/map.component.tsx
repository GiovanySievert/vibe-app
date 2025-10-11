import React, { useEffect, useMemo, useRef } from 'react'
import { StyleSheet } from 'react-native'

import MapboxGL from '@rnmapbox/maps'
import { useAtom } from 'jotai'

import { PlacesModel } from '@src/shared/domain'
import { locationStateAtom } from '@src/shared/state/location.state'

import { MapPin } from '../map-pin'

MapboxGL.setAccessToken(
  'sk.eyJ1IjoiZ2lvdmFueXNpZXZlcnQiLCJhIjoiY21mc2VxbDZrMGJoaDJrb2Z1OHFjb2FzMyJ9.NMRxNjZt9Zzn1_nL5uhO3w'
)

type MapWithPinsProps = {
  points?: PlacesModel[]
  style?: any
  onPressPin?: (point: PlacesModel) => void
}

export const MapWithPins: React.FC<MapWithPinsProps> = ({ points, style, onPressPin }) => {
  const cameraRef = useRef<MapboxGL.Camera>(null)
  const [locationState] = useAtom(locationStateAtom)
  console.log(points)
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
    <MapboxGL.MapView
      style={styles.map}
      styleURL={MapboxGL.StyleURL.Dark}
      logoEnabled={false}
      attributionEnabled={false}
    >
      <MapboxGL.Camera
        centerCoordinate={[locationState.longitude, locationState.latitude]}
        ref={cameraRef}
        zoomLevel={12}
      />

      {points?.map((p) => (
        <MapboxGL.MarkerView
          key={p.id}
          id={p.id}
          coordinate={[p.location.lon, p.location.lat]}
          allowOverlap={true}
          anchor={{ x: 0.5, y: 1.0 }}
        >
          <MapPin name={p.name} image={p.image} onPress={() => onPressPin?.(p)} />
        </MapboxGL.MarkerView>
      ))}
    </MapboxGL.MapView>
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

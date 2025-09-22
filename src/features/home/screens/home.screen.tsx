import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { Screen } from '@src/shared/components/screen'
import Mapbox, { MapView, Camera } from '@rnmapbox/maps'
import { Box } from '@src/shared/components'

Mapbox.setAccessToken(
  'sk.eyJ1IjoiZ2lvdmFueXNpZXZlcnQiLCJhIjoiY21mc2VxbDZrMGJoaDJrb2Z1OHFjb2FzMyJ9.NMRxNjZt9Zzn1_nL5uhO3w'
)

export const HomeScreen = () => {
  return (
    <Screen>
      <Box style={styles.card}>
        <MapView style={styles.map} styleURL={Mapbox.StyleURL.Dark}>
          <Camera centerCoordinate={[-46.6333, -23.5505]} zoomLevel={12} />
        </MapView>
      </Box>
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

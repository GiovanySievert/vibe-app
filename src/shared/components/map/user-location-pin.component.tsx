import React from 'react'
import { StyleSheet, View } from 'react-native'

import MapboxGL from '@rnmapbox/maps'

import { theme } from '@src/shared/constants/theme'

type UserLocationPinProps = {
  coordinate: [number, number]
}

export const UserLocationPin: React.FC<UserLocationPinProps> = ({ coordinate }) => (
  <MapboxGL.MarkerView id="user-location" coordinate={coordinate} allowOverlap={true} anchor={{ x: 0.5, y: 0.5 }}>
    <View style={styles.outer}>
      <View style={styles.inner} />
    </View>
  </MapboxGL.MarkerView>
)

const styles = StyleSheet.create({
  outer: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: theme.colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  inner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.textPrimary,
    borderWidth: 2.5,
    borderColor: theme.colors.background
  }
})

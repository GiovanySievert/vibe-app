import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import MapboxGL from '@rnmapbox/maps'

import { AuthenticatedStackParamList } from '@src/app/navigation/types'
import { theme } from '@src/shared/constants/theme'

import { Box } from '../box'
import { ThemedText } from '../themed-text'

type PinProps = {
  placeId: string
  placeName?: string
  placeIsHot: boolean
  coordinate: [number, number]
  onPress?: () => void
}

export const MapPin: React.FC<PinProps> = ({ placeId, placeName, placeIsHot, coordinate, onPress }) => {
  const navigation = useNavigation<NavigationProp<AuthenticatedStackParamList>>()
  return (
    <MapboxGL.MarkerView
      id={placeId}
      coordinate={coordinate}
      allowOverlap={true}
      anchor={{ x: 0.5, y: 1.0 }}
    >
      <Box style={styles.wrapper} onTouchEnd={onPress}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Modals', { screen: 'PlacesDetailsScreen', params: { placeId } })}
        >
          <Box style={[styles.pill, placeIsHot ? styles.pillHot : styles.pillInactive]}>
            <ThemedText weight="semibold" style={[styles.pillText, placeIsHot && styles.pillTextHot]} numberOfLines={1}>
              {placeName}
            </ThemedText>
          </Box>
          <Box style={[styles.dot, placeIsHot ? styles.dotHot : styles.dotInactive]} />
        </TouchableOpacity>
      </Box>
    </MapboxGL.MarkerView>
  )
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center' },
  pill: {
    paddingHorizontal: 8,
    borderRadius: 7,
    marginBottom: 4,
    zIndex: 5
  },
  pillInactive: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: theme.colors.textTerciary
  },
  pillHot: {
    backgroundColor: theme.colors.primary
  },
  pillText: {
    color: theme.colors.textPrimary,
    fontSize: 13
  },
  pillTextHot: {
    color: theme.colors.background
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    alignSelf: 'center'
  },
  dotInactive: {
    backgroundColor: '#55524D',
    zIndex: 3
  },
  dotHot: {
    backgroundColor: theme.colors.primary
  }
})

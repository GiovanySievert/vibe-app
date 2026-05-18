import React from 'react'
import { StyleSheet } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import MapboxGL from '@rnmapbox/maps'

import { AuthenticatedStackParamList } from '@src/app/navigation/types'
import { theme } from '@src/shared/constants/theme'

import { Box } from '../box'
import { ThemedText } from '../themed-text'
import { Touchable } from '../touchable'

type PinProps = {
  placeId: string
  placeName?: string
  placeIsHot: boolean
  coordinate: [number, number]
}

const MapPinComponent: React.FC<PinProps> = ({ placeId, placeName, placeIsHot, coordinate }) => {
  const navigation = useNavigation<NavigationProp<AuthenticatedStackParamList>>()
  return (
    <MapboxGL.MarkerView id={placeId} coordinate={coordinate} allowOverlap={true} anchor={{ x: 0.5, y: 1.0 }}>
      <Box style={styles.wrapper}>
        <Touchable
          onPress={() =>
            navigation.navigate('Modals', {
              screen: 'PlacesDetailsScreen',
              params: { placeId, isHot: placeIsHot }
            })
          }
          accessibilityRole="button"
          accessibilityLabel={placeName ?? 'Lugar no mapa'}
          accessibilityHint="Abre os detalhes do lugar"
          accessibilityState={{ selected: placeIsHot }}
        >
          <Box style={[styles.pill, placeIsHot ? styles.pillHot : styles.pillInactive]}>
            <ThemedText weight="semibold" style={[styles.pillText, placeIsHot && styles.pillTextHot]} numberOfLines={1}>
              {placeName}
            </ThemedText>
          </Box>
          <Box style={[styles.dot, placeIsHot ? styles.dotHot : styles.dotInactive]} />
        </Touchable>
      </Box>
    </MapboxGL.MarkerView>
  )
}

export const MapPin = React.memo(
  MapPinComponent,
  (prev, next) =>
    prev.placeId === next.placeId &&
    prev.placeName === next.placeName &&
    prev.placeIsHot === next.placeIsHot &&
    prev.coordinate[0] === next.coordinate[0] &&
    prev.coordinate[1] === next.coordinate[1]
)

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

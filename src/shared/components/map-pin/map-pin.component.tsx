import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { AuthenticatedStackParamList } from '@src/app/navigation/types'
import { theme } from '@src/shared/constants/theme'

import { Box } from '../box'
import { ThemedText } from '../themed-text'

type PinProps = {
  placeId: string
  placeName?: string
  placeIsHot: boolean
  onPress?: () => void
}

export const MapPin: React.FC<PinProps> = ({ placeId, placeName, placeIsHot, onPress }) => {
  const navigation = useNavigation<NavigationProp<AuthenticatedStackParamList>>()
  return (
    <Box style={styles.wrapper} onTouchEnd={onPress}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Modals', { screen: 'PlacesDetailsScreen', params: { placeId } })}
      >
        <Box style={[styles.pill, placeIsHot && styles.pillHot]}>
          <ThemedText style={[styles.pillText, placeIsHot && styles.pillTextHot]} numberOfLines={1}>
            {placeName}
          </ThemedText>
        </Box>
        <Box style={[styles.dot, placeIsHot && styles.dotHot]} />
      </TouchableOpacity>
    </Box>
  )
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center' },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: theme.colors.background,
    borderRadius: 20
  },
  pillHot: {
    backgroundColor: theme.colors.primary
  },
  pillText: {
    color: theme.colors.textPrimary,
    fontSize: 12,
    fontFamily: 'InterTight-SemiBold'
  },
  pillTextHot: {
    color: theme.colors.background
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: theme.colors.background,
    alignSelf: 'center',
    marginTop: 2
  },
  dotHot: {
    backgroundColor: theme.colors.primary
  }
})

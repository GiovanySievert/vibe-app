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
  onPress?: () => void
}

export const MapPin: React.FC<PinProps> = ({ placeId, placeName, onPress }) => {
  const navigation = useNavigation<NavigationProp<AuthenticatedStackParamList>>()

  return (
    <Box style={styles.wrapper} onTouchEnd={onPress}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Modals', { screen: 'PlacesDetailsScreen', params: { placeId } })}
      >
        <Box style={styles.pill}>
          <ThemedText style={styles.pillText} numberOfLines={1}>
            {placeName}
          </ThemedText>
        </Box>
        <Box style={styles.dot} />
      </TouchableOpacity>
    </Box>
  )
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center' },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: theme.colors.primary,
    borderRadius: 20
  },
  pillText: {
    color: '#111',
    fontSize: 12,
    fontFamily: 'InterTight-SemiBold'
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: theme.colors.primary,
    alignSelf: 'center',
    marginTop: 2
  }
})

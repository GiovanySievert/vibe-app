import React from 'react'
import { Image, StyleSheet, TouchableOpacity } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { AuthenticatedStackParamList } from '@src/app/navigation/types'

import { Box } from '../box'
import { ThemedText } from '../themed-text'

type PinProps = {
  image: string
  name?: string
  onPress?: () => void
}

export const MapPin: React.FC<PinProps> = ({ image, name, onPress }) => {
  const navigation = useNavigation<NavigationProp<AuthenticatedStackParamList>>()

  return (
    <Box style={styles.wrapper} onTouchEnd={onPress}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Modals', { screen: 'PlaceDetails', params: { placeId: '123' } })}
      >
        <Box style={styles.pinContainer}>
          <Image source={{ uri: image }} style={styles.pinImage} resizeMode="cover" />
        </Box>
        <Box style={styles.pinStem} />
        {!!name && (
          <ThemedText style={styles.pinLabel} numberOfLines={1}>
            {name}
          </ThemedText>
        )}
      </TouchableOpacity>
    </Box>
  )
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center' },
  pinContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#111',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3
  },
  pinImage: { width: '100%', height: '100%' },
  pinStem: {
    width: 2,
    height: 12,
    backgroundColor: '#111',
    marginTop: 2,
    borderRadius: 1
  },
  pinLabel: {
    marginTop: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: '#fff',
    fontSize: 11,
    borderRadius: 6,
    maxWidth: 120
  }
})

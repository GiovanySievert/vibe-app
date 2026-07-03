import React from 'react'
import { StyleSheet } from 'react-native'

import { useAtomValue } from 'jotai'

import { Box, ThemedText } from '@src/shared/components'
import { ThemedIcon } from '@src/shared/components/themed-icon'
import { theme } from '@src/shared/constants/theme'
import { PlacesByIdResponse } from '@src/shared/domain'
import { locationStateAtom } from '@src/shared/state/location.state'
import { formaterAddress } from '@src/shared/utils'
import { calculateDistance } from '@src/shared/utils/calculate-distance'

type PlacesAddressVariant = 'standalone' | 'embedded'

type PlacesAddressProps = {
  place: PlacesByIdResponse
  variant?: PlacesAddressVariant
}

export const PlacesAddress: React.FC<PlacesAddressProps> = ({ place, variant = 'standalone' }) => {
  const userLocation = useAtomValue(locationStateAtom)
  const distance = userLocation
    ? calculateDistance(userLocation.latitude, userLocation.longitude, +place.location.lat, +place.location.lng)
        .toFixed(1)
        .replace('.', ',')
    : null

  const isStandalone = variant === 'standalone'

  return (
    <Box
      flexDirection="row"
      alignItems="flex-start"
      gap={3}
      pl={isStandalone ? 6 : 0}
      pr={isStandalone ? 6 : 0}
      style={isStandalone ? styles.standalone : undefined}>
      <ThemedIcon name="MapPin" color="primary" size={16} />
      <Box flex={1} gap={1}>
        <ThemedText>{formaterAddress(place.location, 'full')}</ThemedText>
        {distance && <ThemedText variant="mono">{distance} km</ThemedText>}
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  standalone: {
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border
  }
})

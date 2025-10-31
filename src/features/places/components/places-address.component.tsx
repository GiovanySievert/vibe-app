import React from 'react'

import { useAtomValue } from 'jotai'

import { Box, Card, ThemedText } from '@src/shared/components'
import { ThemedIcon } from '@src/shared/components/themed-icon'
import { PlacesByIdResponse } from '@src/shared/domain'
import { locationStateAtom } from '@src/shared/state/location.state'
import { formaterAddress } from '@src/shared/utils'
import { calculateDistance } from '@src/shared/utils/calculate-distance'

type PlacesAddressProps = {
  place: PlacesByIdResponse
}

export const PlacesAddress: React.FC<PlacesAddressProps> = ({ place }) => {
  const userLocation = useAtomValue(locationStateAtom)
  return (
    <Box flex={1} pr={5} pl={5} mb={15}>
      <Card gap={3} mb={2} flexDirection="row" alignItems="center">
        <ThemedIcon name="MapPin" color="primary" />
        <Box flexShrink={1}>
          <ThemedText>{formaterAddress(place.location, 'full')}</ThemedText>
          <ThemedText size="sm">
            {calculateDistance(userLocation.latitude, userLocation.longitude, +place.location.lat, +place.location.lng)
              .toFixed(1)
              .replace('.', ',')}
            km
          </ThemedText>
        </Box>
      </Card>
    </Box>
  )
}

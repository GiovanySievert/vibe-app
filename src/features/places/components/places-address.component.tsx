import React from 'react'

import { Box, Card, ThemedText } from '@src/shared/components'
import { ThemedIcon } from '@src/shared/components/themed-icon'

export const PlacesAddress = () => {
  return (
    <Box flex={1}>
      <Card gap={3} mb={2} flexDirection="row" alignItems="center">
        <ThemedIcon name="MapPin" color="primary" />
        <Box>
          <ThemedText>Rua Augusta, 1234 - Consolação, São Paulo</ThemedText>
          <ThemedText size="sm">0.5km de você</ThemedText>
        </Box>
      </Card>
    </Box>
  )
}

import React from 'react'

import { Box, Card, ThemedText } from '@src/shared/components'
import { ThemedIcon } from '@src/shared/components/themed-icon'

export const PlacesOpeningHours = () => {
  return (
    <Box flex={1}>
      <Card gap={3} mb={2} flexDirection="row" alignItems="center">
        <ThemedIcon name="Clock" color="primary" />
        <Box>
          <ThemedText>Horário</ThemedText>
          <ThemedText size="sm">das 19h até as 07h, de seg á seg</ThemedText>
        </Box>
      </Card>
    </Box>
  )
}

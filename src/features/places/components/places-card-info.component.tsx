import React from 'react'

import { Box, Card, ThemedText } from '@src/shared/components'

export const PlacesCardInfo = () => {
  return (
    <Box flex={1}>
      <Box flexDirection="row" justifyContent="space-between" mb={4} gap={3}>
        <Card alignItems="center">
          <ThemedText size="sm" weight="semibold">
            Movimento
          </ThemedText>
          <ThemedText>Lotado</ThemedText>
        </Card>
        <Card alignItems="center">
          <ThemedText size="sm" weight="semibold">
            Pico
          </ThemedText>
          <ThemedText>1h - 3h</ThemedText>
        </Card>

        <Card alignItems="center">
          <ThemedText size="sm" weight="semibold">
            Preço
          </ThemedText>
          <ThemedText>$$</ThemedText>
        </Card>
      </Box>
    </Box>
  )
}

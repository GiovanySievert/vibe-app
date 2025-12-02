import React from 'react'

import { Box, Card, ThemedText } from '@src/shared/components'
import { PlacesByIdResponse } from '@src/shared/domain'

type PlacesCardInfoProps = {
  place: PlacesByIdResponse
}

export const PlacesCardInfo: React.FC<PlacesCardInfoProps> = ({ place }) => {
  return (
    <Box flex={1} pr={5} pl={5}>
      <Box flexDirection="row" justifyContent="space-between" mb={4} gap={3}>
        <Card alignItems="center" flex={1}>
          <ThemedText size="sm" weight="semibold">
            Movimento
          </ThemedText>
          <ThemedText>Lotado</ThemedText>
        </Card>
        <Card alignItems="center" flex={1}>
          <ThemedText size="sm" weight="semibold">
            Pico
          </ThemedText>
          <ThemedText>1h - 3h</ThemedText>
        </Card>

        <Card alignItems="center" flex={1}>
          <ThemedText size="sm" weight="semibold">
            Preço
          </ThemedText>
          <ThemedText>{place.priceRange}</ThemedText>
        </Card>
      </Box>
    </Box>
  )
}

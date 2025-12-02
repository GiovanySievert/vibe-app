import React from 'react'

import { Box, Card, Pill, ThemedText } from '@src/shared/components'
import { PlacesByIdResponse } from '@src/shared/domain'
import { formatCurrency } from '@src/shared/utils'

type PlacesMenuProps = {
  place: PlacesByIdResponse
}

export const PlacesMenu: React.FC<PlacesMenuProps> = ({ place }) => {
  if (place.brand.menus.length) {
    return (
      <Box flex={1} pr={5} pl={5} mt={3} mb={100} alignItems="center">
        <ThemedText weight="light">Local nāo tem cardápio cadastrado :/</ThemedText>
      </Box>
    )
  }

  return (
    <Box flex={1} pr={5} pl={5} mt={3}>
      {place.brand.menus.map((brandMenu) => {
        return (
          <Card mt={3}>
            <Box justifyContent="space-between" flexDirection="row" alignItems="center">
              <Box>
                <ThemedText weight="semibold">{brandMenu.name}</ThemedText>
                <ThemedText size="xs">{brandMenu.description}</ThemedText>
              </Box>
              <Box>
                <Pill textSize="sm" label={formatCurrency(brandMenu.priceCents)} />
              </Box>
            </Box>
          </Card>
        )
      })}
    </Box>
  )
}

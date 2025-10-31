import React from 'react'

import { Box, Pill } from '@src/shared/components'
import { PlacesByIdResponse } from '@src/shared/domain'

type PlacesInfoPillsProps = {
  place: PlacesByIdResponse
}

export const PlacesInfoPills: React.FC<PlacesInfoPillsProps> = ({ place }) => {
  return (
    <Box flex={1} pr={5} pl={5}>
      <Box mb={2} gap={2} mt={2} flexDirection="row" scrollable>
        <Pill label="Mulher feia" />
        <Pill label="Forro" />
        <Pill label="Música Eletrônica" />
        <Pill label="Pista" />
      </Box>
    </Box>
  )
}

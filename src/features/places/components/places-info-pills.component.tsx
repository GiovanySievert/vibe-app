import React from 'react'

import { Box, Pill } from '@src/shared/components'
import { PlacesByIdResponse } from '@src/shared/domain'

type PlacesInfoPillsProps = {
  place: PlacesByIdResponse
}

export const PlacesInfoPills: React.FC<PlacesInfoPillsProps> = ({ place }) => {
  return (
    <Box flex={1}>
      <Box mb={2} gap={2} mt={2} flexDirection="row" scrollable pr={5} pl={2.5}>
        <Pill label="Mulher feia" />
        <Pill label="Forro" />
        <Pill label="Música Eletrônica" />
        <Pill label="Pista" />
      </Box>
    </Box>
  )
}

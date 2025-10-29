import React from 'react'

import { Box, Pill } from '@src/shared/components'

export const PlacesInfoPills = () => {
  return (
    <Box flex={1}>
      <Box mb={2} gap={2} mt={2} flexDirection="row" scrollable>
        <Pill label="Mulher feia" />
        <Pill label="Forro" />
        <Pill label="Música Eletrônica" />
        <Pill label="Pista" />
      </Box>
    </Box>
  )
}

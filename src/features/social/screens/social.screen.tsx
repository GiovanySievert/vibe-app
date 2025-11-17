import React from 'react'

import { UserFavoritesPlacesCards } from '@src/features/user-favorites-places/components'
import { Box, ThemedText } from '@src/shared/components'
import { Screen } from '@src/shared/components/screen'

export const SocialScreen = () => {
  return (
    <Screen>
      <Box pr={5} pl={5} mt={5} mb={5}>
        <ThemedText variant="subtitle">Social</ThemedText>
      </Box>
      <UserFavoritesPlacesCards />
    </Screen>
  )
}

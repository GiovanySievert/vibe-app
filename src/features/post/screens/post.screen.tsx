import React from 'react'

import { Box } from '@src/shared/components/box'
import { ThemedText } from '@src/shared/components/themed-text'

export function PostScreen() {
  return (
    <Box flex={1} alignItems="center" justifyContent="center">
      <ThemedText>post</ThemedText>
    </Box>
  )
}

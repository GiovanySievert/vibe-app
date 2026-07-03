import React from 'react'
import { ActivityIndicator } from 'react-native'

import { theme } from '@src/shared/constants/theme'

import { Box } from '../box'

type LoadingScreenProps = {
  size?: 'small' | 'large'
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ size = 'large' }) => {
  return (
    <Box flex={1} bg="background" alignItems="center" justifyContent="center">
      <ActivityIndicator size={size} color={theme.colors.primary} />
    </Box>
  )
}

import React from 'react'
import { ActivityIndicator } from 'react-native'

import { useInitializeApp } from '@src/features/auth/hooks'
import { Box } from '@src/shared/components'

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading } = useInitializeApp()

  return <Box style={{ position: 'relative', flex: 1 }}>{isLoading ? <ActivityIndicator /> : children}</Box>
}

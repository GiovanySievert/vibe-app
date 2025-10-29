import React from 'react'

import { useInitializeApp } from '@src/features/auth/hooks'
import { Box, LoadingApplication } from '@src/shared/components'

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading } = useInitializeApp()

  return (
    <Box style={{ position: 'relative', flex: 1 }}>
      <LoadingApplication isVisible={isLoading} />
      {children}
    </Box>
  )
}

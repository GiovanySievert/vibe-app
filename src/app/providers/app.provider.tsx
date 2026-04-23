import React from 'react'

import { useAtomValue } from 'jotai'

import { useInitializeApp } from '@src/features/auth/hooks'
import { OnboardingModal } from '@src/features/onboarding/components/onboarding-modal.component'
import { showOnboardingAtom } from '@src/features/onboarding/state/onboarding.state'
import { Box, LoadingApplication } from '@src/shared/components'

type AppProviderProps = {
  children: React.ReactNode
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { isLoading } = useInitializeApp()
  const showOnboarding = useAtomValue(showOnboardingAtom)

  return (
    <Box style={{ position: 'relative', flex: 1 }}>
      <LoadingApplication isVisible={isLoading} />
      {children}
      {showOnboarding && <OnboardingModal />}
    </Box>
  )
}

import React from 'react'

import { useAtomValue } from 'jotai'

import { useAuthSession, useInitializeApp } from '@src/features/auth/hooks'
import { OnboardingModal } from '@src/features/onboarding/components/onboarding-modal.component'
import { showOnboardingAtom } from '@src/features/onboarding/state/onboarding.state'
import { setUnauthorizedHandler } from '@src/services/api/interceptor'
import { Box, LoadingApplication } from '@src/shared/components'
import { KeyboardAccessoryService } from '@src/shared/services/keyboard-accessory/keyboard-accessory.service'

type AppProviderProps = {
  children: React.ReactNode
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { isLoading } = useInitializeApp()
  const showOnboarding = useAtomValue(showOnboardingAtom)
  const { clearAuthSession } = useAuthSession()

  React.useEffect(() => {
    setUnauthorizedHandler(() => clearAuthSession())

    return () => setUnauthorizedHandler(null)
  }, [clearAuthSession])

  React.useEffect(() => {
    KeyboardAccessoryService.setEnabled(true)

    return () => KeyboardAccessoryService.setEnabled(false)
  }, [])

  return (
    <Box style={{ position: 'relative', flex: 1 }}>
      <LoadingApplication isVisible={isLoading} />
      {children}
      {showOnboarding && <OnboardingModal />}
    </Box>
  )
}

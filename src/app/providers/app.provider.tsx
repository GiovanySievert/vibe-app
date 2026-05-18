import React from 'react'

import { useAtomValue } from 'jotai'

import { useAuthSession, useInitializeApp } from '@src/features/auth/hooks'
import { LocationGateModal } from '@src/features/location-gate'
import { OnboardingModal } from '@src/features/onboarding/components/onboarding-modal.component'
import { showOnboardingAtom } from '@src/features/onboarding/state/onboarding.state'
import { setUnauthorizedHandler } from '@src/services/api/interceptor'
import { Box, LoadingApplication } from '@src/shared/components'
import { useInitializeI18n } from '@src/shared/i18n'
import { KeyboardAccessoryService } from '@src/shared/services/keyboard-accessory/keyboard-accessory.service'

type AppProviderProps = {
  children: React.ReactNode
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { isLoading } = useInitializeApp()
  const { isReady: isI18nReady } = useInitializeI18n()
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

  const isAppLoading = isLoading || !isI18nReady

  return (
    <Box style={{ position: 'relative', flex: 1 }}>
      <LoadingApplication isVisible={isAppLoading} />
      {children}
      {showOnboarding && <OnboardingModal />}
      <LocationGateModal />
    </Box>
  )
}

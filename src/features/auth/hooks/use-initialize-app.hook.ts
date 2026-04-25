import { useEffect } from 'react'

import { useSetAtom } from 'jotai'

import { useUserLocation } from '@src/features/home/hooks/use-get-user-location.hook'
import { registerForPushNotificationsAsync } from '@src/features/notifications/services/push-notification.service'
import { showOnboardingAtom } from '@src/features/onboarding/state/onboarding.state'
import { getOnboardingComplete } from '@src/features/onboarding/storage/onboarding-storage'
import { authClient } from '@src/services/api/auth-client'

import { authStateAtom } from '../state'
import { saveAuthTokenInStorage } from '../storage/auth-storage'

export const useInitializeApp = () => {
  const setAuthState = useSetAtom(authStateAtom)
  const setShowOnboarding = useSetAtom(showOnboardingAtom)
  const { loading } = useUserLocation()
  const { data, isPending } = authClient.useSession()

  useEffect(() => {
    const initialize = async () => {
      try {
        if (data) {
          setAuthState({
            isAuthenticated: true,
            user: data.user
          })

          saveAuthTokenInStorage(data.session.token)
          await registerForPushNotificationsAsync()

          const onboardingDone = await getOnboardingComplete()
          if (!onboardingDone) {
            setShowOnboarding(true)
          }
        }
      } catch (error) {
        console.error('Error during app initialization', error)
      }
    }

    initialize()
  }, [data, setAuthState, setShowOnboarding])

  const isLoading = loading || isPending

  return { isLoading }
}

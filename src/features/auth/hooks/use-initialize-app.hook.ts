import { useEffect, useState } from 'react'

import { useSetAtom } from 'jotai'

import { useUserLocation } from '@src/features/home/hooks/use-get-user-location.hook'
import { registerForPushNotificationsAsync } from '@src/features/notifications/services/push-notification.service'
import { showOnboardingAtom } from '@src/features/onboarding/state/onboarding.state'
import { getOnboardingComplete } from '@src/features/onboarding/storage/onboarding-storage'
import { authClient } from '@src/services/api/auth-client'

import { useAuthSession } from './use-auth-session.hook'

export const useInitializeApp = () => {
  const setShowOnboarding = useSetAtom(showOnboardingAtom)
  const [isRestoringAuth, setIsRestoringAuth] = useState(true)
  const { persistAuthSession, restoreAuthSession } = useAuthSession()
  useUserLocation()
  const { data, isPending } = authClient.useSession()

  useEffect(() => {
    const restoreAuth = async () => {
      try {
        await restoreAuthSession()
      } catch (error) {
        console.error('Error restoring auth state', error)
      } finally {
        setIsRestoringAuth(false)
      }
    }

    restoreAuth()
  }, [restoreAuthSession])

  useEffect(() => {
    const initialize = async () => {
      try {
        if (data) {
          await persistAuthSession({ token: data.session.token, user: data.user, session: data.session })
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
  }, [data, persistAuthSession, setShowOnboarding])

  const isLoading = isPending || isRestoringAuth

  return { isLoading }
}

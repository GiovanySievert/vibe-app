import { useEffect } from 'react'

import { useSetAtom } from 'jotai'

import { useUserLocation } from '@src/features/home/hooks/use-get-user-location.hook'
import { authClient } from '@src/services/api/auth-client'

import { authStateAtom } from '../state'
import { saveAuthTokenInStorage } from '../storage/auth-storage'

export const useInitializeApp = () => {
  const setAuthState = useSetAtom(authStateAtom)
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
        }
      } catch (error) {
        console.error('Error during app initialization', error)
      }
    }

    initialize()
  }, [data, setAuthState])

  const isLoading = loading || isPending

  return { isLoading }
}

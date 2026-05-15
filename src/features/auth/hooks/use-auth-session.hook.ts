import { useCallback } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'

import { unregisterPushNotificationsAsync } from '@src/features/notifications/services/push-notification.service'
import { removeStoredPushToken } from '@src/features/notifications/storage/push-token-storage'
import configureAxiosInterceptors from '@src/services/api/interceptor'

import { mapUserData, UserSession } from '../domain'
import { authStateAtom, getUnauthenticatedAuthState } from '../state'
import {
  getAuthTokenFromStorage,
  getUserDataFromStorage,
  removeAuthTokenFromStorage,
  removeUserDataFromStorage,
  saveAuthTokenInStorage,
  saveUserDataInStorage
} from '../storage/auth-storage'

export type AuthSessionPayload = {
  token: string
  user: Parameters<typeof mapUserData>[0]
  session?: UserSession
}

type ClearAuthSessionOptions = {
  unregisterPushNotifications?: boolean
}

export const useAuthSession = () => {
  const setAuthState = useSetAtom(authStateAtom)
  const queryClient = useQueryClient()

  const persistAuthSession = useCallback(
    async ({ token, user, session }: AuthSessionPayload) => {
      const nextAuthState = {
        isAuthenticated: true,
        user: mapUserData(user),
        ...(session ? { session } : {})
      }

      configureAxiosInterceptors(token)
      await saveAuthTokenInStorage(token)
      await saveUserDataInStorage(nextAuthState)
      setAuthState(nextAuthState)
    },
    [setAuthState]
  )

  const restoreAuthSession = useCallback(async () => {
    const [token, storedAuthState] = await Promise.all([getAuthTokenFromStorage(), getUserDataFromStorage()])

    if (token) {
      configureAxiosInterceptors(token)
    }

    if (token && storedAuthState?.user) {
      setAuthState({
        ...storedAuthState,
        isAuthenticated: true,
        user: mapUserData(storedAuthState.user)
      })
    }
  }, [setAuthState])

  const clearAuthSession = useCallback(
    async ({ unregisterPushNotifications = false }: ClearAuthSessionOptions = {}) => {
      configureAxiosInterceptors(null)

      if (unregisterPushNotifications) {
        await unregisterPushNotificationsAsync()
      } else {
        await removeStoredPushToken()
      }

      await Promise.all([removeAuthTokenFromStorage(), removeUserDataFromStorage()])
      queryClient.clear()
      setAuthState(getUnauthenticatedAuthState())
    },
    [queryClient, setAuthState]
  )

  return {
    persistAuthSession,
    restoreAuthSession,
    clearAuthSession
  }
}

import { useQueryClient } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'

import { authStateAtom } from '@src/features/auth/state'
import { removeAuthTokenFromStorage, removeUserDataFromStorage } from '@src/features/auth/storage/auth-storage'
import { unregisterPushNotificationsAsync } from '@src/features/notifications/services/push-notification.service'
import { authClient } from '@src/services/api/auth-client'
import configureAxiosInterceptors from '@src/services/api/interceptor'

export const useLogout = () => {
  const setAuth = useSetAtom(authStateAtom)
  const queryClient = useQueryClient()

  const logout = async () => {
    await unregisterPushNotificationsAsync()

    await authClient.signOut({
      fetchOptions: {
        onSuccess: async () => {
          await removeAuthTokenFromStorage()
          await removeUserDataFromStorage()

          setAuth({
            isAuthenticated: false,
            user: {
              id: '',
              createdAt: new Date(0),
              updatedAt: new Date(0),
              email: '',
              emailVerified: false,
              name: '',
              username: '',
              image: null
            }
          })

          queryClient.clear()
          configureAxiosInterceptors(null)
        }
      }
    })
  }

  return { logout }
}

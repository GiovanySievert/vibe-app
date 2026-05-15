import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'

import { authStateAtom } from '@src/features/auth/state'
import { removeAuthTokenFromStorage, removeUserDataFromStorage } from '@src/features/auth/storage/auth-storage'
import { unregisterPushNotificationsAsync } from '@src/features/notifications/services/push-notification.service'
import { authClient } from '@src/services/api/auth-client'
import configureAxiosInterceptors from '@src/services/api/interceptor'

type DeleteAccountInput = {
  password: string
}

export const useDeleteAccount = () => {
  const setAuth = useSetAtom(authStateAtom)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ password }: DeleteAccountInput) => {
      return authClient.deleteUser({ password })
    },
    onSuccess: async () => {
      await unregisterPushNotificationsAsync()
      await removeAuthTokenFromStorage()
      await removeUserDataFromStorage()

      queryClient.clear()
      configureAxiosInterceptors(null)

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
    }
  })
}

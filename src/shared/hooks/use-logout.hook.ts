import { useSetAtom } from 'jotai'

import { authStateAtom } from '@src/features/auth/state'
import { unregisterPushNotificationsAsync } from '@src/features/notifications/services/push-notification.service'
import { authClient } from '@src/services/api/auth-client'
import configureAxiosInterceptors from '@src/services/api/interceptor'

export const useLogout = () => {
  const setAuth = useSetAtom(authStateAtom)

  const logout = async () => {
    await unregisterPushNotificationsAsync()

    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {}
      }
    })

    setAuth({
      isAuthenticated: false,
      user: {
        id: '',
        createdAt: new Date(0),
        updatedAt: new Date(0),
        email: '',
        emailVerified: false,
        name: '',
        image: null
      }
    })

    configureAxiosInterceptors(null)
  }

  return { logout }
}

import { useAuthSession } from '@src/features/auth/hooks'
import { unregisterPushNotificationsAsync } from '@src/features/notifications/services/push-notification.service'
import { authClient } from '@src/services/api/auth-client'

export const useLogout = () => {
  const { clearAuthSession } = useAuthSession()

  const logout = async () => {
    await unregisterPushNotificationsAsync()

    try {
      await authClient.signOut()
    } finally {
      await clearAuthSession()
    }
  }

  return { logout }
}

import { useMutation } from '@tanstack/react-query'

import { useAuthSession } from '@src/features/auth/hooks'
import { unregisterPushNotificationsAsync } from '@src/features/notifications/services/push-notification.service'
import { authClient } from '@src/services/api/auth-client'

type DeleteAccountInput = {
  password: string
}

export const useDeleteAccount = () => {
  const { clearAuthSession } = useAuthSession()

  return useMutation({
    mutationFn: async ({ password }: DeleteAccountInput) => {
      return authClient.deleteUser({ password })
    },
    onSuccess: async () => {
      await unregisterPushNotificationsAsync()
      await clearAuthSession()
    }
  })
}

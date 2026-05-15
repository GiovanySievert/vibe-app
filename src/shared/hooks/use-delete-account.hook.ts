import { useMutation } from '@tanstack/react-query'

import { useAuthSession } from '@src/features/auth/hooks'
import { unregisterPushNotificationsAsync } from '@src/features/notifications/services/push-notification.service'
import { authClient } from '@src/services/api/auth-client'

type DeleteAccountInput = {
  password: string
}

type UseDeleteAccountOptions = {
  onError?: (error: Error) => void
}

export const useDeleteAccount = ({ onError }: UseDeleteAccountOptions = {}) => {
  const { clearAuthSession } = useAuthSession()

  return useMutation({
    mutationFn: async ({ password }: DeleteAccountInput) => {
      const result = await authClient.deleteUser({ password })
      if (result.error) {
        throw new Error(result.error.message ?? 'Failed to delete account')
      }
      return result.data
    },
    onSuccess: async () => {
      await unregisterPushNotificationsAsync()
      await clearAuthSession()
    },
    onError
  })
}

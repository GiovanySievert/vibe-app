import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { NotificationType } from '../../inbox/services/notification-inbox.service'
import {
  NotificationPreferencesService,
  NotificationPreferenceView} from '../services/notification-preferences.service'

export const useNotificationPreferences = () => {
  return useQuery<NotificationPreferenceView[], Error>({
    queryKey: ['notifications', 'preferences'],
    queryFn: async () => {
      const response = await NotificationPreferencesService.list()
      return response.data
    }
  })
}

export const useUpdateNotificationPreference = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: {
      type: NotificationType
      pushEnabled?: boolean
      inAppEnabled?: boolean
    }) => {
      const response = await NotificationPreferencesService.update(input.type, {
        pushEnabled: input.pushEnabled,
        inAppEnabled: input.inAppEnabled
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', 'preferences'] })
    }
  })
}

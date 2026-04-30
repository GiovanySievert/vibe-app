import { AxiosResponse } from 'axios'

import { coreApi } from '@src/services/api'

import { NotificationType } from '../../inbox/services/notification-inbox.service'

export type NotificationPreferenceView = {
  type: NotificationType
  pushEnabled: boolean
  inAppEnabled: boolean
}

export const NotificationPreferencesService = {
  list: (): Promise<AxiosResponse<NotificationPreferenceView[]>> =>
    coreApi.get('/notifications/preferences'),

  update: (
    type: NotificationType,
    body: { pushEnabled?: boolean; inAppEnabled?: boolean }
  ): Promise<AxiosResponse<NotificationPreferenceView>> =>
    coreApi.put(`/notifications/preferences/${type}`, body)
}

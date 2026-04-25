import { AxiosResponse } from 'axios'

import { coreApi } from '@src/services/api'

export const NotificationDeviceService = {
  register: (payload: {
    token: string
    platform: string
    deviceId?: string
    appBuild?: string
    permissionStatus: string
  }): Promise<AxiosResponse<void>> => coreApi.post('/notification-devices', payload),

  unregister: (token: string): Promise<AxiosResponse<void>> =>
    coreApi.delete('/notification-devices', {
      data: { token }
    })
}

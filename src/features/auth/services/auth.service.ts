import { AxiosResponse } from 'axios'

import { coreApi } from '@src/services/api'

export const AuthService = {
  checkIfUsernameIsAvailable: (username: string): Promise<AxiosResponse<{ available: boolean }>> =>
    coreApi.get(`/auth/check-username?username=${username}`),

  updateUsername: (username: string): Promise<AxiosResponse<{ username: string }>> =>
    coreApi.patch('/auth/username', { username })
}

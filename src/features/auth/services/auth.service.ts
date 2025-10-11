import { AxiosResponse } from 'axios'

import { api } from '@src/services/api'

export const AuthService = {
  checkIfUsernameIsAvailable: (username: string): Promise<AxiosResponse<{ available: boolean }>> =>
    api.get(`/auth/check-username?username=${username}`)
}

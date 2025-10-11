import { AxiosResponse } from 'axios'

import { api } from '@src/services/api'

import { DeleteAccountBodyRequestDTO } from '../domain/user.mappers'

export const UserMenuService = {
  deleteAccount: (data: DeleteAccountBodyRequestDTO): Promise<AxiosResponse<{ success: boolean }>> =>
    api.post('/auth/delete-user', { password: data.password })
}

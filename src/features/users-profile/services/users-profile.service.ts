import { AxiosResponse } from 'axios'

import { coreApi } from '@src/services/api'
import { UserModel } from '@src/shared/domain/users.model'

export const UsersProfileService = {
  fetchUserById: (userId: string): Promise<AxiosResponse<UserModel>> => coreApi.get(`public-users/${userId}`)
}

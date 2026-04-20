import { AxiosResponse } from 'axios'

import { coreApi } from '@src/services/api'
import { GetUserByUsername } from '@src/shared/domain/users.model'

export const SearchService = {
  fetchUsersByUsername: (username: string): Promise<AxiosResponse<GetUserByUsername[]>> =>
    coreApi.get(`/public-users/username/${username}`)
}

import { AxiosResponse } from 'axios'

import { coreApi } from '@src/services/api'

export const SearchService = {
  fetchUsersByUsername: (username: string): Promise<AxiosResponse<any[]>> =>
    coreApi.get(`/public-users/username/${username}`)
}

import { AxiosResponse } from 'axios'

import { coreApi } from '@src/services/api'

import { UserFollowStatsResponse } from '../types'

export const FollowStatsService = {
  fetchUsersFollowStats: (userId: string): Promise<AxiosResponse<UserFollowStatsResponse>> =>
    coreApi.get(`follow-stats/${userId}`)
}

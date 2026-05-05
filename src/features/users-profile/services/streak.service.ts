import { AxiosResponse } from 'axios'

import { coreApi } from '@src/services/api'

import { UserStreakResponse } from '../types'

export const StreakService = {
  fetchMyStreak: (): Promise<AxiosResponse<UserStreakResponse>> => coreApi.get('streaks/me'),
  fetchUserStreak: (userId: string): Promise<AxiosResponse<UserStreakResponse>> =>
    coreApi.get(`streaks/${userId}`)
}

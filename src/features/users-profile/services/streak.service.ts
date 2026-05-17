import { AxiosResponse } from 'axios'

import { coreApi } from '@src/services/api'

import { FriendsStreakResponse, UserStreakResponse } from '../types'

export const StreakService = {
  fetchMyStreak: (): Promise<AxiosResponse<UserStreakResponse>> => coreApi.get('streaks/me'),
  fetchMyFriendsStreaks: (limit = 5): Promise<AxiosResponse<FriendsStreakResponse>> =>
    coreApi.get('streaks/me/friends', { params: { limit } }),
  fetchUserStreak: (userId: string): Promise<AxiosResponse<UserStreakResponse>> =>
    coreApi.get(`streaks/${userId}`)
}

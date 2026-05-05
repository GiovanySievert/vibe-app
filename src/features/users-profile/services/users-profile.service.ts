import { AxiosResponse } from 'axios'

import { coreApi } from '@src/services/api'
import { UserModel, UserSuggestion, TrendingUser } from '@src/shared/domain/users.model'

export const UsersProfileService = {
  fetchUserById: (userId: string): Promise<AxiosResponse<UserModel>> => coreApi.get(`public-users/${userId}`),
  fetchSuggestions: (): Promise<AxiosResponse<UserSuggestion[]>> => coreApi.get('public-users/suggestions'),
  fetchTrending: (): Promise<AxiosResponse<TrendingUser[]>> => coreApi.get('public-users/trending')
}

import { AxiosResponse } from 'axios'

import { coreApi } from '@src/services/api'

import { GetFollowStatusResponse, ListFollowersResponse, ListFollowingsResponse } from '../types'

export const FollowService = {
  getFollowStatus: (userId: string): Promise<AxiosResponse<GetFollowStatusResponse>> =>
    coreApi.get(`followers/status/${userId}`),
  unfollow: (userId: string): Promise<AxiosResponse<void>> => coreApi.delete(`followers/${userId}`),
  removeFollower: (userId: string): Promise<AxiosResponse<void>> => coreApi.delete(`followers/remove/${userId}`),
  listFollowings: (
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<AxiosResponse<ListFollowingsResponse[]>> =>
    coreApi.get(`followers/following/${userId}?page=${page}&limit=${limit}`),
  listFollowers: (
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<AxiosResponse<ListFollowersResponse[]>> => coreApi.get(`followers/${userId}?page=${page}&limit=${limit}`)
}

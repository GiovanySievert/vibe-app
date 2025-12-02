import { AxiosResponse } from 'axios'

import { coreApi } from '@src/services/api'

import {
  ListFollowersResponse,
  ListFollowingsResponse,
  ListUserAllFollowRequestsResponse,
  UserFollowStatsResponse
} from '../types'

export const FollowService = {
  checkIfUserFollows: (userId: string): Promise<AxiosResponse<boolean>> => coreApi.get(`follow/${userId}`),
  requestFollow: (userId: string): Promise<AxiosResponse<void>> => coreApi.post(`follows/${userId}`),
  acceptFollowRequest: (requestFollowId: string): Promise<AxiosResponse<void>> =>
    coreApi.post(`follows/requests/${requestFollowId}/accept`),
  rejectFollowRequest: (requestFollowId: string): Promise<AxiosResponse<void>> =>
    coreApi.post(`follows/requests/${requestFollowId}/reject`),
  unfollow: (userId: string): Promise<AxiosResponse<void>> => coreApi.post(`follow-requests/follow/${userId}`),
  listUserAllFollowRequests: (): Promise<AxiosResponse<ListUserAllFollowRequestsResponse[]>> =>
    coreApi.get(`follows/requests`),
  fetchUsersFollowStats: (userId: string): Promise<AxiosResponse<UserFollowStatsResponse>> =>
    coreApi.get(`follow-stats/${userId}`),
  listFollowings: (userId: string, page: number = 1, limit: number = 10): Promise<AxiosResponse<ListFollowingsResponse[]>> =>
    coreApi.get(`follows/followings/${userId}?page=${page}&limit=${limit}`),
  listFollowers: (userId: string, page: number = 1, limit: number = 10): Promise<AxiosResponse<ListFollowersResponse[]>> =>
    coreApi.get(`follows/followers/${userId}?page=${page}&limit=${limit}`)
}

import { AxiosResponse } from 'axios'

import { coreApi } from '@src/services/api'

import { ListUserAllFollowRequestsResponse } from '../types'

export const FollowRequestsService = {
  listUserAllFollowRequests: (
    page: number = 1,
    limit: number = 10
  ): Promise<AxiosResponse<ListUserAllFollowRequestsResponse[]>> =>
    coreApi.get(`follow-requests?page=${page}&limit=${limit}`),
  listUserAllRequestedFollowRequests: (
    page: number = 1,
    limit: number = 10
  ): Promise<AxiosResponse<ListUserAllFollowRequestsResponse[]>> =>
    coreApi.get(`follow-requests/requested?page=${page}&limit=${limit}`),
  requestFollow: (userId: string): Promise<AxiosResponse<void>> => coreApi.post(`follow-requests/send/${userId}`),
  cancelRequestFollow: (userId: string): Promise<AxiosResponse<void>> => coreApi.delete(`follow-requests/${userId}`),
  acceptFollowRequest: (requestFollowId: string): Promise<AxiosResponse<void>> =>
    coreApi.post(`follow-requests/${requestFollowId}/accept`),
  rejectFollowRequest: (requestFollowId: string): Promise<AxiosResponse<void>> =>
    coreApi.post(`follow-requests/${requestFollowId}/reject`)
}

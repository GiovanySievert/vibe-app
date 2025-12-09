import { AxiosResponse } from 'axios'

import { coreApi } from '@src/services/api'

import { GetBlockStatusResponse, ListBlockedUsersResponse } from '../types'

export const BlockService = {
  listBlockedUsers: (): Promise<AxiosResponse<ListBlockedUsersResponse[]>> => coreApi.get('blocks'),
  block: (userId: string): Promise<AxiosResponse<void>> => coreApi.post(`blocks/${userId}`),
  unblock: (userId: string): Promise<AxiosResponse<void>> => coreApi.delete(`blocks/${userId}`),
  fetchBlockStatus: (userId: string): Promise<AxiosResponse<GetBlockStatusResponse>> =>
    coreApi.get(`blocks/${userId}/status`)
}

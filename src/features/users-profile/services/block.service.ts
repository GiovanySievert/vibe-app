import { AxiosResponse } from 'axios'

import { coreApi } from '@src/services/api'

import { GetBlockStatusResponse } from '../types'

export const BlockService = {
  block: (userId: string): Promise<AxiosResponse<void>> => coreApi.post(`blocks/${userId}`),
  unblock: (userId: string): Promise<AxiosResponse<void>> => coreApi.delete(`blocks/${userId}`),
  fetchBlockStatus: (userId: string): Promise<AxiosResponse<GetBlockStatusResponse>> =>
    coreApi.get(`blocks/${userId}/status`)
}

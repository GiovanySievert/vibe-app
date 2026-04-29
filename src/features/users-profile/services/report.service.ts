import { AxiosResponse } from 'axios'

import { coreApi } from '@src/services/api'

import { CreateReportPayload, CreateReportResponse } from '../types'

export const ReportService = {
  report: (userId: string, payload: CreateReportPayload): Promise<AxiosResponse<CreateReportResponse>> =>
    coreApi.post(`reports/${userId}`, payload)
}

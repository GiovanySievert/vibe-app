import { AxiosResponse } from 'axios'

import { coreApi } from '@src/services/api'

import { ContactMessageResponse } from '../types'

export const ContactService = {
  send: (payload: { message: string }): Promise<AxiosResponse<ContactMessageResponse>> =>
    coreApi.post('contact-messages', payload)
}

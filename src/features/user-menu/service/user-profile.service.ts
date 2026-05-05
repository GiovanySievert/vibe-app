import { AxiosResponse } from 'axios'

import { coreApi } from '@src/services/api'

export type UpdateUserProfilePayload = {
  name: string
  bio?: string
  image?: string
}

export type UpdateUserProfileResponse = {
  id: string
  name: string
  bio: string | null
  image: string | null
  updatedAt: string
}

export const UserProfileService = {
  update: (payload: UpdateUserProfilePayload): Promise<AxiosResponse<UpdateUserProfileResponse>> =>
    coreApi.patch('user-profile', payload)
}

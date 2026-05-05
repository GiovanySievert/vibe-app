import { useQuery } from '@tanstack/react-query'

import { authClient } from '@src/services/api/auth-client'

import { FollowService } from '../services'
import { GetFollowStatusResponse } from '../types'

export const getFollowStatusQueryKey = (viewerUserId?: string, targetUserId?: string) => [
  'followStatus',
  viewerUserId,
  targetUserId
]

export const useFollowStatus = (targetUserId: string, enabled: boolean = true) => {
  const { data: session } = authClient.useSession()
  const viewerUserId = session?.user.id

  return useQuery<GetFollowStatusResponse, Error>({
    queryKey: getFollowStatusQueryKey(viewerUserId, targetUserId),
    queryFn: async () => (await FollowService.getFollowStatus(targetUserId)).data,
    enabled: enabled && !!targetUserId && !!viewerUserId,
    retry: false,
    staleTime: 0
  })
}

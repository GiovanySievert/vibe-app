import { useQuery } from '@tanstack/react-query'

import { authClient } from '@src/services/api/auth-client'

import { BlockService } from '../services'
import { GetBlockStatusResponse } from '../types'

export const getBlockStatusQueryKey = (viewerUserId?: string, targetUserId?: string) => [
  'fetchBlockStatusById',
  viewerUserId,
  targetUserId
]

export const useBlockStatus = (targetUserId: string, enabled: boolean = true) => {
  const { data: session } = authClient.useSession()
  const viewerUserId = session?.user.id

  return useQuery<GetBlockStatusResponse, Error>({
    queryKey: getBlockStatusQueryKey(viewerUserId, targetUserId),
    queryFn: async () => (await BlockService.fetchBlockStatus(targetUserId)).data,
    enabled: enabled && !!targetUserId && !!viewerUserId,
    retry: false,
    staleTime: 60 * 5
  })
}

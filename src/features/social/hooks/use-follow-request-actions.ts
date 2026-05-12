import { InfiniteData, useQueryClient } from '@tanstack/react-query'

import { FollowRequestsService } from '@src/features/users-profile/services'
import { FollowRequestType, ListUserAllFollowRequestsResponse } from '@src/features/users-profile/types'
import { authClient } from '@src/services/api/auth-client'

interface UseFollowRequestActionsProps {
  type: FollowRequestType
  queryKeySuffix?: string
}

export const useFollowRequestActions = ({ type, queryKeySuffix = '' }: UseFollowRequestActionsProps) => {
  const { data: userLoggedData } = authClient.useSession()
  const queryClient = useQueryClient()

  const baseKey = type === FollowRequestType.RECEIVED ? 'receivedFollowRequests' : 'sentFollowRequests'
  const fullQueryKey = [baseKey, userLoggedData?.user.id, queryKeySuffix].filter(Boolean)
  const isInfinite = queryKeySuffix === 'infinite'

  const removeRequestFromCache = (requestFollowId: string) => {
    queryClient.setQueryData<
      ListUserAllFollowRequestsResponse[] | InfiniteData<ListUserAllFollowRequestsResponse[]>
    >(fullQueryKey, (oldData) => {
      if (!oldData) return oldData

      if (isInfinite) {
        const infiniteData = oldData as InfiniteData<ListUserAllFollowRequestsResponse[]>
        return {
          ...infiniteData,
          pages: infiniteData.pages.map((page) => page.filter((req) => req.id !== requestFollowId))
        }
      }

      const arrayData = oldData as ListUserAllFollowRequestsResponse[]
      return arrayData.filter((req) => req.id !== requestFollowId)
    })
  }

  const handleRequestAction = async (requestFollowId: string, action: (id: string) => Promise<unknown>) => {
    try {
      removeRequestFromCache(requestFollowId)
      await action(requestFollowId)
    } catch {
      queryClient.invalidateQueries({ queryKey: fullQueryKey })
    }
  }

  const acceptFollowRequest = (requestFollowId: string) =>
    handleRequestAction(requestFollowId, FollowRequestsService.acceptFollowRequest)

  const rejectFollowRequest = (requestFollowId: string) =>
    handleRequestAction(requestFollowId, FollowRequestsService.rejectFollowRequest)

  const cancelFollowRequest = (requestFollowId: string) =>
    handleRequestAction(requestFollowId, FollowRequestsService.cancelRequestFollow)

  return {
    acceptFollowRequest,
    rejectFollowRequest,
    cancelFollowRequest
  }
}

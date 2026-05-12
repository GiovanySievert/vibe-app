import { InfiniteData, useQueryClient } from '@tanstack/react-query'

import { BlockService } from '@src/features/users-profile/services'
import { ListBlockedUsersResponse } from '@src/features/users-profile/types'
import { authClient } from '@src/services/api/auth-client'

interface UseBlockActionsProps {
  queryKeySuffix?: string
}

export const useBlockActions = ({ queryKeySuffix = '' }: UseBlockActionsProps = {}) => {
  const { data: userLoggedData } = authClient.useSession()
  const queryClient = useQueryClient()

  const fullQueryKey = ['blockedUsers', userLoggedData?.user.id, queryKeySuffix].filter(Boolean)
  const isInfinite = queryKeySuffix === 'infinite'

  const removeUserFromCache = (userId: string) => {
    queryClient.setQueryData<ListBlockedUsersResponse[] | InfiniteData<ListBlockedUsersResponse[]>>(
      fullQueryKey,
      (oldData) => {
        if (!oldData) return oldData

        if (isInfinite) {
          const infiniteData = oldData as InfiniteData<ListBlockedUsersResponse[]>
          return {
            ...infiniteData,
            pages: infiniteData.pages.map((page) => page.filter((user) => user.userId !== userId))
          }
        }

        const arrayData = oldData as ListBlockedUsersResponse[]
        return arrayData.filter((user) => user.userId !== userId)
      }
    )
  }

  const handleUnblockAction = async (userId: string) => {
    try {
      removeUserFromCache(userId)
      await BlockService.unblock(userId)
    } catch {
      queryClient.invalidateQueries({ queryKey: fullQueryKey })
    }
  }

  return {
    unblockUser: handleUnblockAction
  }
}

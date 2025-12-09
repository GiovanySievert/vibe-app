import { InfiniteData, useQueryClient } from '@tanstack/react-query'

import { BlockService } from '@src/features/users-profile/services'
import { ListBlockedUsersResponse } from '@src/features/users-profile/types'
import { authClient } from '@src/services/api/auth-client'

import { InfiniteBlockedPage } from './use-blocked-users'

interface UseBlockActionsProps {
  queryKeySuffix?: string
}

export const useBlockActions = ({ queryKeySuffix = '' }: UseBlockActionsProps = {}) => {
  const { data: userLoggedData } = authClient.useSession()
  const queryClient = useQueryClient()

  const fullQueryKey = ['blockedUsers', userLoggedData?.user.id, queryKeySuffix].filter(Boolean)

  const removeUserFromCache = (userId: string) => {
    queryClient.setQueryData<ListBlockedUsersResponse[] | InfiniteData<InfiniteBlockedPage>>(
      fullQueryKey,
      (oldData) => {
        if (!oldData) return oldData

        if (queryKeySuffix === 'infinite') {
          const infiniteData = oldData as InfiniteData<InfiniteBlockedPage>
          return {
            ...infiniteData,
            pages: infiniteData.pages.map((page) => ({
              ...page,
              data: page.data.filter((user) => user.userId !== userId)
            }))
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

import { useQuery, useInfiniteQuery } from '@tanstack/react-query'

import { BlockService } from '@src/features/users-profile/services'
import { ListBlockedUsersResponse } from '@src/features/users-profile/types'
import { authClient } from '@src/services/api/auth-client'

export interface InfiniteBlockedPage {
  data: ListBlockedUsersResponse[]
  nextPage: number
  hasMore: boolean
}

const getQueryKey = (userId: string | undefined) => {
  return ['blockedUsers', userId]
}

const fetchBlockedUsers = async () => {
  const response = await BlockService.listBlockedUsers()
  return response.data
}

export const useBlockedUsers = () => {
  const { data: userLoggedData } = authClient.useSession()

  return useQuery<ListBlockedUsersResponse[], Error>({
    queryKey: getQueryKey(userLoggedData?.user.id),
    queryFn: fetchBlockedUsers,
    retry: false,
    staleTime: 60 * 5
  })
}

export const useInfiniteBlockedUsers = () => {
  const { data: userLoggedData } = authClient.useSession()

  const fetchInfiniteBlockedUsers = async ({ pageParam = 1 }: { pageParam: number }) => {
    const response = await BlockService.listBlockedUsers()
    return {
      data: response.data,
      nextPage: pageParam + 1,
      hasMore: false
    } as InfiniteBlockedPage
  }

  const queryKey = getQueryKey(userLoggedData?.user.id)

  return useInfiniteQuery({
    queryKey: [...queryKey, 'infinite'],
    queryFn: fetchInfiniteBlockedUsers,
    getNextPageParam: (lastPage: InfiniteBlockedPage) => (lastPage.hasMore ? lastPage.nextPage : undefined),
    initialPageParam: 1
  })
}

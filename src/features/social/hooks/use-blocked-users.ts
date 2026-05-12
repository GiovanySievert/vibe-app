import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

import { BlockService } from '@src/features/users-profile/services'
import { ListBlockedUsersResponse } from '@src/features/users-profile/types'
import { authClient } from '@src/services/api/auth-client'

const PAGE_SIZE = 10

const getQueryKey = (userId: string | undefined) => ['blockedUsers', userId]

const fetchPage = async (page: number, limit: number) => {
  const response = await BlockService.listBlockedUsers(page, limit)
  return response.data
}

export const useBlockedUsers = () => {
  const { data: userLoggedData } = authClient.useSession()

  return useQuery<ListBlockedUsersResponse[], Error>({
    queryKey: getQueryKey(userLoggedData?.user.id),
    queryFn: () => fetchPage(1, PAGE_SIZE),
    retry: false,
    staleTime: 60 * 5
  })
}

export const useInfiniteBlockedUsers = () => {
  const { data: userLoggedData } = authClient.useSession()
  const queryKey = [...getQueryKey(userLoggedData?.user.id), 'infinite']

  return useInfiniteQuery<ListBlockedUsersResponse[]>({
    queryKey,
    queryFn: ({ pageParam = 1 }) => fetchPage(pageParam as number, PAGE_SIZE),
    getNextPageParam: (lastPage, allPages) => (lastPage.length === PAGE_SIZE ? allPages.length + 1 : undefined),
    initialPageParam: 1,
    retry: false
  })
}

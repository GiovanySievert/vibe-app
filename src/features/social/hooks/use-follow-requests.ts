import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

import { FollowRequestsService } from '@src/features/users-profile/services'
import { FollowRequestType, ListUserAllFollowRequestsResponse } from '@src/features/users-profile/types'
import { authClient } from '@src/services/api/auth-client'

const PAGE_SIZE = 10

interface UseFollowRequestsProps {
  type: FollowRequestType
}

const getQueryKey = (type: FollowRequestType, userId: string | undefined) => {
  const key = type === FollowRequestType.RECEIVED ? 'receivedFollowRequests' : 'sentFollowRequests'
  return [key, userId]
}

const fetchPage = async (type: FollowRequestType, page: number, limit: number) => {
  const response =
    type === FollowRequestType.RECEIVED
      ? await FollowRequestsService.listUserAllFollowRequests(page, limit)
      : await FollowRequestsService.listUserAllRequestedFollowRequests(page, limit)
  return response.data
}

export const useFollowRequests = ({ type }: UseFollowRequestsProps) => {
  const { data: userLoggedData } = authClient.useSession()

  return useQuery<ListUserAllFollowRequestsResponse[], Error>({
    queryKey: getQueryKey(type, userLoggedData?.user.id),
    queryFn: () => fetchPage(type, 1, PAGE_SIZE),
    retry: false,
    staleTime: 60 * 5
  })
}

export const useInfiniteFollowRequests = ({ type }: UseFollowRequestsProps) => {
  const { data: userLoggedData } = authClient.useSession()
  const queryKey = [...getQueryKey(type, userLoggedData?.user.id), 'infinite']

  return useInfiniteQuery<ListUserAllFollowRequestsResponse[]>({
    queryKey,
    queryFn: ({ pageParam = 1 }) => fetchPage(type, pageParam as number, PAGE_SIZE),
    getNextPageParam: (lastPage, allPages) => (lastPage.length === PAGE_SIZE ? allPages.length + 1 : undefined),
    initialPageParam: 1,
    retry: false
  })
}

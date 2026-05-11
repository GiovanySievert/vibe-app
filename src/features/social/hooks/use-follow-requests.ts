import { useQuery } from '@tanstack/react-query'

import { FollowRequestsService } from '@src/features/users-profile/services'
import { FollowRequestType, ListUserAllFollowRequestsResponse } from '@src/features/users-profile/types'
import { authClient } from '@src/services/api/auth-client'

interface UseFollowRequestsProps {
  type: FollowRequestType
}

const getQueryKey = (type: FollowRequestType, userId: string | undefined) => {
  const key = type === FollowRequestType.RECEIVED ? 'receivedFollowRequests' : 'sentFollowRequests'
  return [key, userId]
}

const fetchFollowRequests = async (type: FollowRequestType) => {
  const response =
    type === FollowRequestType.RECEIVED
      ? await FollowRequestsService.listUserAllFollowRequests()
      : await FollowRequestsService.listUserAllRequestedFollowRequests()
  return response.data
}

export const useFollowRequests = ({ type }: UseFollowRequestsProps) => {
  const { data: userLoggedData } = authClient.useSession()

  return useQuery<ListUserAllFollowRequestsResponse[], Error>({
    queryKey: getQueryKey(type, userLoggedData?.user.id),
    queryFn: () => fetchFollowRequests(type),
    retry: false,
    staleTime: 60 * 5
  })
}

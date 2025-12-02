import { useQuery } from '@tanstack/react-query'

import { Box, SwipeableModal, ThemedText } from '@src/shared/components'

import { FollowService } from '../services'
import { ListFollowersResponse } from '../types'

type FollowListProps = {
  userId: string
  type: string
}

enum FOLLOW_TYPE {
  FOLLOWERS = 'FOLLOWERS',
  FOLLOWING = 'FOLLOWING'
}

export const UsersProfileFollowActions: React.FC<FollowListProps> = ({ userId, type }) => {
  const fetchFollow = async () => {
    if (type === FOLLOW_TYPE.FOLLOWERS) {
      const response = await FollowService.listFollowers(userId)
      return response.data
    }
    const response = await FollowService.listFollowings(userId)
    return response.data
  }

  const { data: followsList, isLoading } = useQuery<ListFollowersResponse[], Error>({
    queryKey: ['fetchFollow', userId],
    queryFn: fetchFollow,
    retry: false,
    staleTime: 60 * 5
  })

  if (!followsList) {
    return <></>
  }

  return (
    <SwipeableModal visible={true} onClose={() => {}}>
      {followsList?.map((follow, index) => {
        return (
          <Box>
            <ThemedText>{follow.username}</ThemedText>
          </Box>
        )
      })}
    </SwipeableModal>
  )
}

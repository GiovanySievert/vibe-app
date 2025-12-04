import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { authClient } from '@src/services/api/auth-client'
import { Box, Button, ThemedText } from '@src/shared/components'
import { UserModel } from '@src/shared/domain/users.model'

import { FollowRequestsService, FollowService } from '../services'
import { FollowStatus, GetFollowStatusResponse } from '../types'

type UsersProfileFollowActionsProps = {
  userData: UserModel
}

export const UsersProfileFollowActions: React.FC<UsersProfileFollowActionsProps> = ({ userData }) => {
  const { data: userLoggedData } = authClient.useSession()
  const queryClient = useQueryClient()

  const queryKey = ['fetchUserById', userLoggedData?.user.id, userData.id]

  const fetchUser = async () => {
    const response = await FollowService.getFollowStatus(userData.id)

    return response.data
  }

  const { data: followData, isLoading } = useQuery<GetFollowStatusResponse, Error>({
    queryKey,
    queryFn: fetchUser,
    retry: false,
    staleTime: 60 * 5
  })

  const followMutation = useMutation({
    mutationFn: (action: 'follow' | 'unfollow' | 'cancel') => {
      if (action === 'follow') return FollowRequestsService.requestFollow(userData.id)
      if (action === 'unfollow') return FollowService.unfollow(userData!.id)
      return FollowRequestsService.cancelRequestFollow(followData!.id)
    },
    onMutate: async (action) => {
      await queryClient.cancelQueries({ queryKey })

      const previousData = queryClient.getQueryData<GetFollowStatusResponse>(queryKey)

      const newStatus =
        action === 'follow' ? FollowStatus.PENDING : action === 'cancel' ? FollowStatus.NONE : FollowStatus.NONE

      queryClient.setQueryData<GetFollowStatusResponse>(queryKey, { status: newStatus, id: followData!.id })

      return { previousData }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: ['fetchFollowersStats', userData.id] })
    }
  })

  const handlePressToUnfollowOrUnfollow = () => {
    if (followData?.status === FollowStatus.FOLLOWING) {
      followMutation.mutate('unfollow')
    } else if (followData?.status === FollowStatus.NONE) {
      followMutation.mutate('follow')
    } else if (followData?.status === FollowStatus.PENDING) {
      followMutation.mutate('cancel')
    }
  }

  const handleFollowText = () => {
    if (followData?.status === FollowStatus.FOLLOWING) {
      return 'Seguindo'
    }

    if (followData?.status === FollowStatus.NONE) {
      return 'Seguir'
    }

    if (followData?.status === FollowStatus.PENDING) {
      return 'Aguardando Solicitação'
    }

    return 'Seguir'
  }

  if (isLoading) {
    return null
  }

  return (
    <Box pr={5} pl={5} mt={3}>
      <Button loading={isLoading || followMutation.isPending} onPress={handlePressToUnfollowOrUnfollow}>
        <ThemedText weight="semibold" size="lg">
          {handleFollowText()}
        </ThemedText>
      </Button>
    </Box>
  )
}

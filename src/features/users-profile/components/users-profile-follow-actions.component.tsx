import { StyleSheet, TouchableOpacity } from 'react-native'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { authClient } from '@src/services/api/auth-client'
import { Box, Button, ThemedText } from '@src/shared/components'
import { theme } from '@src/shared/constants/theme'
import { UserModel } from '@src/shared/domain/users.model'

import { FollowRequestsService, FollowService } from '../services'
import { FollowAction, FollowStatus, GetFollowStatusResponse } from '../types'

type UsersProfileFollowActionsProps = {
  userData: UserModel
  compact?: boolean
}

export const UsersProfileFollowActions: React.FC<UsersProfileFollowActionsProps> = ({ userData, compact = false }) => {
  const { data: userLoggedData } = authClient.useSession()
  const queryClient = useQueryClient()

  const queryKey = ['fetchFollowStatusById', userLoggedData?.user.id, userData.id]

  const fetchFollowStatus = async () => {
    const response = await FollowService.getFollowStatus(userData.id)
    return response.data
  }

  const { data: followData, isLoading } = useQuery<GetFollowStatusResponse, Error>({
    queryKey,
    queryFn: fetchFollowStatus,
    retry: false,
    staleTime: 60 * 5
  })

  const followMutation = useMutation({
    mutationFn: (action: FollowAction) => {
      if (action === FollowAction.FOLLOW) return FollowRequestsService.requestFollow(userData.id)
      if (action === FollowAction.UNFOLLOW) return FollowService.unfollow(userData!.id)
      return FollowRequestsService.cancelRequestFollow(followData!.id)
    },
    onMutate: async (action) => {
      await queryClient.cancelQueries({ queryKey })
      const previousData = queryClient.getQueryData<GetFollowStatusResponse>(queryKey)
      const newStatus =
        action === FollowAction.FOLLOW
          ? FollowStatus.PENDING
          : action === FollowAction.CANCEL
            ? FollowStatus.NONE
            : FollowStatus.NONE
      queryClient.setQueryData<GetFollowStatusResponse>(queryKey, { status: newStatus, id: followData!.id })
      return { previousData }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData) queryClient.setQueryData(queryKey, context.previousData)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: ['fetchFollowersStats', userData.id] })
    }
  })

  const handlePress = () => {
    if (followData?.status === FollowStatus.FOLLOWING) followMutation.mutate(FollowAction.UNFOLLOW)
    else if (followData?.status === FollowStatus.NONE) followMutation.mutate(FollowAction.FOLLOW)
    else if (followData?.status === FollowStatus.PENDING) followMutation.mutate(FollowAction.CANCEL)
  }

  const followLabel = () => {
    if (followData?.status === FollowStatus.FOLLOWING) return 'seguindo'
    if (followData?.status === FollowStatus.PENDING) return 'aguardando'
    return 'seguir'
  }

  if (compact) {
    const isFollowing = followData?.status === FollowStatus.FOLLOWING
    return (
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        style={isFollowing ? styles.btnFollowing : styles.btn}
      >
        <ThemedText weight="semibold" size="sm" style={isFollowing ? styles.textFollowing : styles.text}>
          {followLabel()}
        </ThemedText>
      </TouchableOpacity>
    )
  }

  return (
    <Box pl={5} pr={5} mt={3}>
      <Button loading={isLoading || followMutation.isPending} onPress={handlePress}>
        <ThemedText weight="semibold" size="lg">
          {followLabel()}
        </ThemedText>
      </Button>
    </Box>
  )
}

const styles = StyleSheet.create({
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignContent: 'center'
  },
  btnFollowing: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  text: { color: theme.colors.background },
  textFollowing: { color: theme.colors.textSecondary }
})

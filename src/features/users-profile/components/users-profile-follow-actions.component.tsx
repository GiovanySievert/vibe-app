import { StyleSheet } from 'react-native'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { authClient } from '@src/services/api/auth-client'
import { Box, Button, ThemedText, Touchable } from '@src/shared/components'
import { theme } from '@src/shared/constants/theme'
import { UserModel } from '@src/shared/domain/users.model'
import { triggerLightHaptic } from '@src/shared/utils'

import { getFollowStatusQueryKey, useFollowStatus } from '../hooks/use-follow-status.hook'
import { FollowRequestsService, FollowService } from '../services'
import { FollowAction, FollowStatus, GetFollowStatusResponse } from '../types'

type UsersProfileFollowActionsProps = {
  userData: UserModel
  compact?: boolean
}

export const UsersProfileFollowActions: React.FC<UsersProfileFollowActionsProps> = ({ userData, compact = false }) => {
  const { data: userLoggedData } = authClient.useSession()
  const queryClient = useQueryClient()

  const queryKey = getFollowStatusQueryKey(userLoggedData?.user.id, userData.id)
  const { data: followData, isLoading } = useFollowStatus(userData.id, !!userLoggedData?.user.id)

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
    if (followData?.status === FollowStatus.FOLLOWING) {
      followMutation.mutate(FollowAction.UNFOLLOW)
    } else if (followData?.status === FollowStatus.NONE) {
      followMutation.mutate(FollowAction.FOLLOW)
    } else if (followData?.status === FollowStatus.PENDING) {
      followMutation.mutate(FollowAction.CANCEL)
    }
    triggerLightHaptic()
  }

  const followLabel = () => {
    if (followData?.status === FollowStatus.FOLLOWING) return 'seguindo'
    if (followData?.status === FollowStatus.PENDING) return 'aguardando'
    return 'seguir'
  }

  if (compact) {
    const isFollowing = followData?.status === FollowStatus.FOLLOWING
    return (
      <Touchable
        onPress={handlePress}
        activeOpacity={0.7}
        style={isFollowing ? styles.btnFollowing : styles.btn}
      >
        <ThemedText weight="semibold" size="sm" style={isFollowing ? styles.textFollowing : styles.text}>
          {followLabel()}
        </ThemedText>
      </Touchable>
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

import { TouchableOpacity } from 'react-native'

import { useQuery } from '@tanstack/react-query'

import { useUserReviews } from '@src/features/users-profile/hooks/use-user-reviews.hook'
import { Avatar, Box, ThemedIcon, ThemedText } from '@src/shared/components'
import { UserModel } from '@src/shared/domain/users.model'

import { FollowStatsService } from '../services'
import { UserFollowStatsResponse } from '../types'
import { UsersProfileHeaderLoading } from './users-profile-header-loading.component'

type UsersProfileHeaderProps = {
  userData: UserModel
  onOpenFollowers: () => void
  onOpenFollowings: () => void
}

export const UsersProfileHeaderScreen: React.FC<UsersProfileHeaderProps> = ({
  userData,
  onOpenFollowers,
  onOpenFollowings
}) => {
  const fetchFollowersStats = async () => {
    const response = await FollowStatsService.fetchUsersFollowStats(userData.id)
    return response.data
  }
  const { data, isLoading } = useQuery<UserFollowStatsResponse, Error>({
    queryKey: ['fetchFollowersStats', userData.id],
    queryFn: fetchFollowersStats,
    retry: false,
    staleTime: 0
  })

  const { data: reviews } = useUserReviews(userData.id)
  const vibesCount = reviews?.length ?? 0

  const handleOpenFollowers = () => {
    if (data && data.followersCount > 0) onOpenFollowers()
  }

  const handleOpenFollowings = () => {
    if (data && data.followingCount > 0) onOpenFollowings()
  }

  if (isLoading) {
    return <UsersProfileHeaderLoading />
  }

  return (
    <Box pl={5} pr={5} pt={6} pb={4}>
      <Box flexDirection="row" alignItems="center" justifyContent="space-between">
        <Avatar size="lg" uri={userData.image} />

        <Box flexDirection="row" gap={6}>
          <Box alignItems="center" justifyContent="center">
            <ThemedText weight="bold" size="lg" color="textPrimary">
              {vibesCount}
            </ThemedText>
            <ThemedText variant="mono" size="xs" color="textSecondary">
              vibes
            </ThemedText>
          </Box>

          <TouchableOpacity onPress={handleOpenFollowers}>
            <Box alignItems="center">
              <ThemedText weight="bold" size="lg" color="textPrimary">
                {data?.followersCount ?? 0}
              </ThemedText>
              <ThemedText variant="mono" size="xs" color="textSecondary">
                seguidores
              </ThemedText>
            </Box>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleOpenFollowings}>
            <Box alignItems="center">
              <ThemedText weight="bold" size="lg" color="textPrimary">
                {data?.followingCount ?? 0}
              </ThemedText>
              <ThemedText variant="mono" size="xs" color="textSecondary">
                seguindo
              </ThemedText>
            </Box>
          </TouchableOpacity>
        </Box>
      </Box>

      <Box mt={4} gap={1}>
        <ThemedText color="textPrimary" size="xl" weight="bold">
          {userData.username}
        </ThemedText>
        {userData.bio && (
          <ThemedText size="sm" color="textPrimary" weight="medium">
            {userData.bio}
          </ThemedText>
        )}
        <Box flexDirection="row" alignItems="center" gap={1} mt={1}>
          <ThemedIcon name="User" size={12} color="textSecondary" />
          <ThemedText size="xs" color="textSecondary" variant="mono">
            usuário beta
          </ThemedText>
        </Box>
        <Box flexDirection="row" alignItems="center" gap={1} mt={-1}>
          <ThemedIcon name="Crown" size={12} color="textSecondary" />
          <ThemedText size="xs" color="textSecondary" variant="mono">
            rei do janela
          </ThemedText>
        </Box>
      </Box>
    </Box>
  )
}

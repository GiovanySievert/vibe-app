import { StyleSheet, TouchableOpacity } from 'react-native'

import { useQuery } from '@tanstack/react-query'

import { Avatar, Box, Divider, ThemedText } from '@src/shared/components'
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

  const handleOpenFollowers = () => {
    if (data && data.followersCount > 0) {
      onOpenFollowers()
    }
  }

  const handleOpenFollowings = () => {
    if (data && data.followingCount > 0) {
      onOpenFollowings()
    }
  }

  if (isLoading) {
    return <UsersProfileHeaderLoading />
  }

  return (
    <>
      <Box flexDirection="row" justifyContent="space-around" alignItems="center" mt={3} mb={3}>
        <Box flexDirection="row" alignItems="center" gap={3}>
          <Avatar />
          <ThemedText variant="primary" weight="semibold" size="lg">
            {userData?.username}
          </ThemedText>
        </Box>

        <Box flexDirection="row" gap={3} mt={6}>
          <TouchableOpacity style={styles.centeredBox} onPress={handleOpenFollowings}>
            <ThemedText variant="primary" weight="semibold">
              {data?.followingCount || 0}
            </ThemedText>
            <ThemedText variant="secondary" size="sm">
              Seguindo
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.centeredBox} onPress={handleOpenFollowers}>
            <ThemedText variant="primary" weight="semibold">
              {data?.followersCount || 0}
            </ThemedText>
            <ThemedText variant="secondary" size="sm">
              Seguidores
            </ThemedText>
          </TouchableOpacity>
        </Box>
      </Box>

      <Divider />
    </>
  )
}

const styles = StyleSheet.create({
  centeredBox: {
    alignItems: 'center'
  }
})

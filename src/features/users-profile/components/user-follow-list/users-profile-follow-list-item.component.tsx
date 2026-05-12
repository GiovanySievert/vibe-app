import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

import { Avatar, Box, ThemedText } from '@src/shared/components'
import { useNavigateToProfile } from '@src/shared/hooks'

import { ListFollowersResponse } from '../../types'
import { UsersProfileFollowListActions } from './users-profile-follow-list-actions.component'

type UsersProfileFollowListItem = {
  followRelation: ListFollowersResponse
  type: string
  isUserLoggedProfile: boolean
}

export const UsersProfileFollowListItem: React.FC<UsersProfileFollowListItem> = ({
  followRelation,
  type,
  isUserLoggedProfile
}) => {
  const navigateToProfile = useNavigateToProfile()

  return (
    <TouchableOpacity style={styles.container} onPress={() => navigateToProfile(followRelation.userId)}>
      <Avatar size="sm" uri={followRelation.image} fallbackLetter={followRelation.name || followRelation.username} />
      <Box flex={1} gap={1}>
        <ThemedText weight="semibold" size="sm" color="textPrimary">
          {followRelation.name || followRelation.username}
        </ThemedText>
        <ThemedText size="xs" color="textSecondary">
          @{followRelation.username}
        </ThemedText>
      </Box>
      {isUserLoggedProfile && <UsersProfileFollowListActions followRelation={followRelation} type={type} />}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10
  }
})

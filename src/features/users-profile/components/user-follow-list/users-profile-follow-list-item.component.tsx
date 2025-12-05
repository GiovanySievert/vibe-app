import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { Avatar, Box, ThemedText } from '@src/shared/components'

import { ListFollowersResponse } from '../../types'
import { UsersProfileFollowListActions } from './users-profile-follow-list-actions.component'

type UsersProfileFollowListItem = {
  followRelation: ListFollowersResponse
  type: string
  isUserLoggedProfile: boolean
  onClose: () => void
}

export const UsersProfileFollowListItem: React.FC<UsersProfileFollowListItem> = ({
  followRelation,
  type,
  isUserLoggedProfile,
  onClose
}) => {
  const navigation = useNavigation<any>()

  const handlePressUser = (userItemId: string) => {
    onClose()
    navigation.navigate('UsersProfileScreen', { userId: userItemId })
  }

  return (
    <TouchableOpacity style={styles.userItem} onPress={() => handlePressUser(followRelation.id)}>
      <Box flexDirection="row" justifyContent="space-between" alignItems="center">
        <Box flexDirection="row" alignItems="center" gap={5}>
          <Avatar size="sm" />
          <ThemedText variant="primary" weight="semibold">
            {followRelation.username}
          </ThemedText>
        </Box>
        {isUserLoggedProfile && <UsersProfileFollowListActions followRelation={followRelation} type={type} />}
      </Box>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  userItem: {}
})

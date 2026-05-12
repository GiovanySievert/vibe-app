import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { AuthenticatedStackParamList } from '@src/app/navigation/types'
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
  const navigation = useNavigation<NavigationProp<AuthenticatedStackParamList>>()

  const handlePressUser = (userItemId: string) => {
    onClose()
    navigation.navigate('Modals', { screen: 'UsersProfileScreen', params: { userId: userItemId } })
  }

  return (
    <TouchableOpacity style={styles.container} onPress={() => handlePressUser(followRelation.id)}>
      <Avatar
        size="sm"
        uri={followRelation.image}
        fallbackLetter={followRelation.name || followRelation.username}
      />
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

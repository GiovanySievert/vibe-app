import React from 'react'
import { TouchableOpacity } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { AuthenticatedStackParamList } from '@src/app/navigation/types'
import { ListBlockedUsersResponse } from '@src/features/users-profile/types'
import { Avatar, Box, Divider, ThemedText } from '@src/shared/components'

import { BlockedUserActions } from './blocked-user-actions.component'

interface BlockedUserItemProps {
  item: ListBlockedUsersResponse
  index: number
  totalItems: number
  onUnblock: (userId: string) => void
}

export const BlockedUserItem = ({ item, index, totalItems, onUnblock }: BlockedUserItemProps) => {
  const navigation = useNavigation<NavigationProp<AuthenticatedStackParamList>>()

  return (
    <Box mb={5}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Modals', {
            screen: 'UsersProfileScreen',
            params: { userId: item.userId }
          })
        }
      >
        <Box flexDirection="column" justifyContent="space-between" gap={4} mb={4}>
          <Box flexDirection="row" alignItems="center" gap={3}>
            <Avatar ring={0} uri={item.avatar} size="md" />
            <ThemedText color="textPrimary" size="lg" weight="semibold">
              {item.username}
            </ThemedText>
          </Box>
          <Box flexDirection="row" gap={2}>
            <BlockedUserActions userId={item.userId} onUnblock={onUnblock} />
          </Box>
        </Box>
      </TouchableOpacity>
      {index !== totalItems - 1 && <Divider />}
    </Box>
  )
}

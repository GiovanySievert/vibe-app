import React from 'react'
import { TouchableOpacity } from 'react-native'

import { ListBlockedUsersResponse } from '@src/features/users-profile/types'
import { Avatar, Box, Card, ThemedText } from '@src/shared/components'
import { useNavigateToProfile } from '@src/shared/hooks'

import { BlockedUserActions } from './blocked-user-actions.component'

interface BlockedUserItemProps {
  item: ListBlockedUsersResponse
  onUnblock: (userId: string) => void
}

export const BlockedUserItem = ({ item, onUnblock }: BlockedUserItemProps) => {
  const navigateToProfile = useNavigateToProfile()

  const handlePress = () => navigateToProfile(item.userId)

  return (
    <Card pr={3} pl={3} pt={3} pb={3}>
      <Box flexDirection="row" alignItems="center" gap={3}>
        <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
          <Avatar uri={item.avatar} size="sm" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handlePress} activeOpacity={0.7} style={{ flex: 1 }}>
          <Box gap={1}>
            <ThemedText weight="bold" size="md" textTransform="capitalize">
              {item.username}
            </ThemedText>
            <ThemedText variant="mono" size="xs">
              @{item.username}
            </ThemedText>
          </Box>
        </TouchableOpacity>

        <BlockedUserActions userId={item.userId} username={item.username} onUnblock={onUnblock} />
      </Box>
    </Card>
  )
}

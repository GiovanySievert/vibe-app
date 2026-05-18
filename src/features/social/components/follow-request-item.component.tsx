import React from 'react'

import { FollowRequestType, ListUserAllFollowRequestsResponse } from '@src/features/users-profile/types'
import { Avatar, Box, Card, ThemedText, Touchable } from '@src/shared/components'
import { useNavigateToProfile } from '@src/shared/hooks'

import { FollowRequestActions } from './follow-request-actions.component'

interface FollowRequestItemProps {
  item: ListUserAllFollowRequestsResponse
  type: FollowRequestType
  onAccept: (id: string) => void
  onReject: (id: string) => void
  onCancel: (id: string) => void
}

export const FollowRequestItem = ({ item, type, onAccept, onReject, onCancel }: FollowRequestItemProps) => {
  const navigateToProfile = useNavigateToProfile()

  const handlePress = () => navigateToProfile(item.userId)

  return (
    <Card pr={3} pl={3} pt={3} pb={3}>
      <Box flexDirection="row" alignItems="center" gap={3}>
        <Touchable onPress={handlePress} activeOpacity={0.7}>
          <Avatar uri={item.avatar} size="sm" />
        </Touchable>

        <Touchable onPress={handlePress} activeOpacity={0.7} style={{ flex: 1 }}>
          <Box gap={1}>
            <ThemedText weight="bold" size="md" textTransform="capitalize">
              {item.username}
            </ThemedText>
            <ThemedText variant="mono" size="xs">
              @{item.username}
            </ThemedText>
          </Box>
        </Touchable>

        <FollowRequestActions
          type={type}
          requestId={item.id}
          onAccept={onAccept}
          onReject={onReject}
          onCancel={onCancel}
        />
      </Box>
    </Card>
  )
}

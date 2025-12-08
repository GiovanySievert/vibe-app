import React from 'react'
import { TouchableOpacity } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { AuthenticatedStackParamList } from '@src/app/navigation/types'
import { FollowRequestType, ListUserAllFollowRequestsResponse } from '@src/features/users-profile/types'
import { Avatar, Box, Divider, ThemedText } from '@src/shared/components'

import { FollowRequestActions } from './follow-request-actions.component'

interface FollowRequestItemProps {
  item: ListUserAllFollowRequestsResponse
  type: FollowRequestType
  index: number
  totalItems: number
  onAccept: (id: string) => void
  onReject: (id: string) => void
  onCancel: (id: string) => void
}

export const FollowRequestItem = ({
  item,
  type,
  index,
  totalItems,
  onAccept,
  onReject,
  onCancel
}: FollowRequestItemProps) => {
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
            <FollowRequestActions
              type={type}
              requestId={item.id}
              onAccept={onAccept}
              onReject={onReject}
              onCancel={onCancel}
            />
          </Box>
        </Box>
      </TouchableOpacity>
      {index !== totalItems - 1 && <Divider />}
    </Box>
  )
}

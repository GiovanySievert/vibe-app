import React from 'react'
import { Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { AuthenticatedStackParamList } from '@src/app/navigation/types'
import { FollowRequestType, ListUserAllFollowRequestsResponse } from '@src/features/users-profile/types'
import { Box, ThemedText } from '@src/shared/components'

import { useFollowRequestActions } from '../hooks/use-follow-request-actions'
import { useFollowRequests } from '../hooks/use-follow-requests'
import { FollowRequestItem } from './follow-request-item.component'

interface FollowRequestsListProps {
  type: FollowRequestType
  limit?: number
}

export const FollowRequestsList = ({ type, limit }: FollowRequestsListProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthenticatedStackParamList>>()
  const { acceptFollowRequest, rejectFollowRequest, cancelFollowRequest } = useFollowRequestActions({ type })
  const { data: followRequestsData, isLoading } = useFollowRequests({ type })

  if (!followRequestsData?.length || isLoading) {
    return null
  }

  const title = type === FollowRequestType.RECEIVED ? 'solicitações' : 'solicitações enviadas'
  const total = followRequestsData.length
  const displayedRequests = limit ? followRequestsData.slice(0, limit) : followRequestsData
  const hasMore = !!limit && total > limit
  const count = total.toString().padStart(2, '0')

  const openModal = () =>
    navigation.navigate('Modals', {
      screen: 'FollowRequestsScreen',
      params: { type: type === FollowRequestType.RECEIVED ? 'received' : 'sent' }
    })

  return (
    <Box mr={5} ml={5} gap={3}>
      <Box flexDirection="row" justifyContent="space-between" alignItems="center">
        <ThemedText variant="mono" size="xs" textTransform="uppercase" letterSpacing="wider">
          {title}
        </ThemedText>
        <ThemedText variant="mono" size="xs" letterSpacing="wider">
          {count}
        </ThemedText>
      </Box>

      <Box gap={3}>
        {displayedRequests.map((item: ListUserAllFollowRequestsResponse) => (
          <FollowRequestItem
            key={item.id}
            item={item}
            type={type}
            onAccept={acceptFollowRequest}
            onReject={rejectFollowRequest}
            onCancel={cancelFollowRequest}
          />
        ))}
      </Box>

      {hasMore && (
        <Pressable onPress={openModal}>
          <ThemedText variant="mono" size="xs" color="textSecondary">
            ver todas ({count})
          </ThemedText>
        </Pressable>
      )}
    </Box>
  )
}

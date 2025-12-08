import React from 'react'
import { FlatList } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { SocialStackParamList } from '@src/app/navigation/types'
import { FollowRequestType, ListUserAllFollowRequestsResponse } from '@src/features/users-profile/types'
import { Box, Button, ThemedText } from '@src/shared/components'

import { useFollowRequestActions } from '../hooks/use-follow-request-actions'
import { useFollowRequests } from '../hooks/use-follow-requests'
import { FollowRequestItem } from './follow-request-item.component'

interface FollowRequestsListProps {
  type: FollowRequestType
  limit?: number
}

export const FollowRequestsList = ({ type, limit }: FollowRequestsListProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<SocialStackParamList>>()
  const { acceptFollowRequest, rejectFollowRequest, cancelFollowRequest } = useFollowRequestActions({ type })
  const { data: followRequestsData, isLoading } = useFollowRequests({ type })

  if (!followRequestsData?.length || isLoading) {
    return
  }

  const title = type === FollowRequestType.RECEIVED ? 'Solicitações' : 'Solicitações Enviadas'
  const displayedRequests = limit ? followRequestsData.slice(0, limit) : followRequestsData
  const hasMore = limit && followRequestsData.length > limit

  const handleSeeMore = () => {
    navigation.navigate('FollowRequestsScreen', {
      type: type === FollowRequestType.RECEIVED ? 'received' : 'sent'
    })
  }

  const renderItem = ({ item, index }: { item: ListUserAllFollowRequestsResponse; index: number }) => (
    <FollowRequestItem
      item={item}
      type={type}
      index={index}
      totalItems={displayedRequests.length}
      onAccept={acceptFollowRequest}
      onReject={rejectFollowRequest}
      onCancel={cancelFollowRequest}
    />
  )

  const renderFooter = () => {
    if (!hasMore) return null

    return (
      <Box mt={3}>
        <Button onPress={handleSeeMore} type="secondary">
          <ThemedText variant="primary" weight="medium" size="lg">
            Ver mais
          </ThemedText>
        </Button>
      </Box>
    )
  }

  return (
    <Box mr={5} ml={5} gap={3}>
      <ThemedText>{title}</ThemedText>
      <FlatList
        data={displayedRequests}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        ListFooterComponent={renderFooter}
      />
    </Box>
  )
}

import React from 'react'
import { FlatList, ScrollView, StyleSheet } from 'react-native'
import { RouteProp, useRoute } from '@react-navigation/native'

import { SocialStackParamList } from '@src/app/navigation/types'
import { FollowRequestType, ListUserAllFollowRequestsResponse } from '@src/features/users-profile/types'
import { Box, ThemedText } from '@src/shared/components'
import { theme } from '@src/shared/constants/theme'

import { FollowRequestItem } from '../components/follow-request-item.component'
import { useFollowRequestActions } from '../hooks/use-follow-request-actions'
import { useInfiniteFollowRequests } from '../hooks/use-follow-requests'

export const FollowRequestsScreen = () => {
  const route = useRoute<RouteProp<SocialStackParamList, 'FollowRequestsScreen'>>()

  const { type } = route.params
  const requestType = type === 'received' ? FollowRequestType.RECEIVED : FollowRequestType.SENT

  const { acceptFollowRequest, rejectFollowRequest, cancelFollowRequest } = useFollowRequestActions({
    type: requestType,
    queryKeySuffix: 'infinite'
  })

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteFollowRequests({
    type: requestType
  })

  const allRequests = data?.pages.flatMap((page) => page.data) ?? []

  const renderItem = ({ item, index }: { item: ListUserAllFollowRequestsResponse; index: number }) => (
    <FollowRequestItem
      item={item}
      type={requestType}
      index={index}
      totalItems={allRequests.length}
      onAccept={acceptFollowRequest}
      onReject={rejectFollowRequest}
      onCancel={cancelFollowRequest}
    />
  )

  return (
    <ScrollView style={styles.scroll}>
      <FlatList
        data={allRequests}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
          }
        }}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          !isLoading ? (
            <Box mt={10} alignItems="center">
              <ThemedText color="textSecondary">Nenhuma Solicitaçāo</ThemedText>
            </Box>
          ) : null
        }
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  listContent: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20
  },
  scroll: { flex: 1, backgroundColor: theme.colors.background }
})

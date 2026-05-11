import React from 'react'
import { Dimensions, FlatList, StyleSheet } from 'react-native'

import { FollowRequestType, ListUserAllFollowRequestsResponse } from '@src/features/users-profile/types'
import { Box, ThemedText } from '@src/shared/components'
import { SwipeableModal } from '@src/shared/components/swipeable-modal'

import { useFollowRequestActions } from '../hooks/use-follow-request-actions'
import { useFollowRequests } from '../hooks/use-follow-requests'
import { FollowRequestItem } from './follow-request-item.component'

const MODAL_HEIGHT = Dimensions.get('window').height * 0.85

type Props = {
  visible: boolean
  type: FollowRequestType
  onClose: () => void
}

export const FollowRequestsModal: React.FC<Props> = ({ visible, type, onClose }) => {
  const { acceptFollowRequest, rejectFollowRequest, cancelFollowRequest } = useFollowRequestActions({ type })
  const { data: requests, isLoading } = useFollowRequests({ type })

  const allRequests = requests ?? []
  const title = type === FollowRequestType.RECEIVED ? 'solicitações' : 'solicitações enviadas'
  const count = allRequests.length.toString().padStart(2, '0')

  const renderItem = ({ item }: { item: ListUserAllFollowRequestsResponse }) => (
    <FollowRequestItem
      item={item}
      type={type}
      onAccept={acceptFollowRequest}
      onReject={rejectFollowRequest}
      onCancel={cancelFollowRequest}
    />
  )

  return (
    <SwipeableModal visible={visible} onClose={onClose} height={MODAL_HEIGHT}>
      <Box style={styles.container}>
        <Box pl={5} pr={5} pb={4} flexDirection="row" alignItems="center" justifyContent="space-between">
          <ThemedText variant="mono" size="xs" textTransform="uppercase" letterSpacing="wider">
            {title}
          </ThemedText>
          <ThemedText variant="mono" size="xs" letterSpacing="wider">
            {count}
          </ThemedText>
        </Box>

        <FlatList
          data={allRequests}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <Box style={styles.separator} />}
          ListEmptyComponent={
            !isLoading ? (
              <Box mt={6} alignItems="center">
                <ThemedText variant="mono" size="xs" color="textSecondary">
                  nenhuma solicitação
                </ThemedText>
              </Box>
            ) : null
          }
        />
      </Box>
    </SwipeableModal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40
  },
  separator: {
    height: 12
  }
})

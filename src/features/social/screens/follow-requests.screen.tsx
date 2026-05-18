import React from 'react'
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { ModalNavigatorParamsList } from '@src/app/navigation/types'
import { FollowRequestType, ListUserAllFollowRequestsResponse } from '@src/features/users-profile/types'
import { Box, ThemedText } from '@src/shared/components'
import { Screen } from '@src/shared/components/screen'
import { theme } from '@src/shared/constants/theme'
import { useAppTranslation } from '@src/shared/i18n'

import { FollowRequestItem } from '../components/follow-request-item.component'
import { useFollowRequestActions } from '../hooks/use-follow-request-actions'
import { useInfiniteFollowRequests } from '../hooks/use-follow-requests'

type Props = NativeStackScreenProps<ModalNavigatorParamsList, 'FollowRequestsScreen'>

export const FollowRequestsScreen: React.FC<Props> = ({ route }) => {
  const { t } = useAppTranslation()
  const type = route.params.type === 'received' ? FollowRequestType.RECEIVED : FollowRequestType.SENT

  const { acceptFollowRequest, rejectFollowRequest, cancelFollowRequest } = useFollowRequestActions({
    type,
    queryKeySuffix: 'infinite'
  })

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteFollowRequests({ type })

  const allRequests = data?.pages.flatMap((page) => page) ?? []
  const title =
    type === FollowRequestType.RECEIVED
      ? t('social.followRequests.receivedTitle')
      : t('social.followRequests.sentTitle')
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

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage()
  }

  return (
    <Screen>
      <Box flex={1} pt={5}>
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
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <Box mt={4} alignItems="center">
                <ActivityIndicator color={theme.colors.primary} />
              </Box>
            ) : null
          }
          ListEmptyComponent={
            !isLoading ? (
              <Box mt={6} alignItems="center">
                <ThemedText variant="mono" size="xs" color="textSecondary">
                  {t('social.followRequests.empty')}
                </ThemedText>
              </Box>
            ) : null
          }
        />
      </Box>
    </Screen>
  )
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40
  },
  separator: {
    height: 12
  }
})

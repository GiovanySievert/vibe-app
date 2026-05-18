import React from 'react'
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { ModalNavigatorParamsList } from '@src/app/navigation/types'
import { BlockedUserItem } from '@src/features/social/components/blocked-user-item.component'
import { useBlockActions } from '@src/features/social/hooks/use-block-actions'
import { useInfiniteBlockedUsers } from '@src/features/social/hooks/use-blocked-users'
import { ListBlockedUsersResponse } from '@src/features/users-profile/types'
import { Box, ThemedText } from '@src/shared/components'
import { Screen } from '@src/shared/components/screen'
import { theme } from '@src/shared/constants/theme'
import { useAppTranslation } from '@src/shared/i18n'

type Props = NativeStackScreenProps<ModalNavigatorParamsList, 'BlockedUsersScreen'>

export const BlockedUsersScreen: React.FC<Props> = () => {
  const { unblockUser } = useBlockActions({ queryKeySuffix: 'infinite' })
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteBlockedUsers()
  const { t } = useAppTranslation()

  const blockedUsers = data?.pages.flatMap((page) => page) ?? []
  const count = blockedUsers.length.toString().padStart(2, '0')

  const renderItem = ({ item }: { item: ListBlockedUsersResponse }) => (
    <BlockedUserItem item={item} onUnblock={unblockUser} />
  )

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage()
  }

  return (
    <Screen>
      <Box flex={1} pt={5}>
        <Box pl={5} pr={5} pb={4} flexDirection="row" alignItems="center" justifyContent="space-between">
          <ThemedText variant="mono" size="xs" textTransform="uppercase" letterSpacing="wider">
            {t('userMenu.privacy.blockedSection')}
          </ThemedText>
          <ThemedText variant="mono" size="xs" letterSpacing="wider">
            {count}
          </ThemedText>
        </Box>

        <FlatList
          data={blockedUsers}
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
                  {t('userMenu.privacy.emptyBlocked')}
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

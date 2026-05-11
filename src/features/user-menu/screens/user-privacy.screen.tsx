import React from 'react'
import { FlatList, ScrollView, StyleSheet } from 'react-native'

import { BlockedUserItem } from '@src/features/social/components/blocked-user-item.component'
import { useBlockActions } from '@src/features/social/hooks/use-block-actions'
import { useInfiniteBlockedUsers } from '@src/features/social/hooks/use-blocked-users'
import { ListBlockedUsersResponse } from '@src/features/users-profile/types'
import { Box, GoBackButton, ThemedText } from '@src/shared/components'
import { Screen } from '@src/shared/components/screen'
import { theme } from '@src/shared/constants/theme'

export const UserPrivacyScreen = () => {
  const { unblockUser } = useBlockActions({ queryKeySuffix: 'infinite' })
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteBlockedUsers()

  const blockedUsers = data?.pages.flatMap((page) => page.data) ?? []

  const renderItem = ({ item, index }: { item: ListBlockedUsersResponse; index: number }) => (
    <BlockedUserItem item={item} index={index} totalItems={blockedUsers.length} onUnblock={unblockUser} />
  )

  return (
    <ScrollView style={styles.scroll}>
      <Screen>
        <Box pr={5} pl={5} mt={5} mb={5} flexDirection="row" alignItems="center" gap={3}>
          <GoBackButton />
          <Box>
            <ThemedText variant="title">privacidade</ThemedText>
            <ThemedText variant="mono">bloqueados · controles</ThemedText>
          </Box>
        </Box>
        <Box mr={5} ml={5} gap={6}>
          <Box gap={2}>
            <ThemedText size="lg" weight="semibold">
              Usuários bloqueados
            </ThemedText>
            <ThemedText size="sm" color="textSecondary">
              Eles não podem te seguir, te marcar ou ver suas publicações.
            </ThemedText>
          </Box>

          <FlatList
            data={blockedUsers}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage()
              }
            }}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={
              !isLoading ? (
                <Box mt={4}>
                  <ThemedText color="textSecondary">Você ainda não bloqueou ninguém.</ThemedText>
                </Box>
              ) : null
            }
          />
        </Box>
      </Screen>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: theme.colors.background }
})

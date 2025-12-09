import React from 'react'
import { FlatList, ScrollView, StyleSheet } from 'react-native'

import { ListBlockedUsersResponse } from '@src/features/users-profile/types'
import { Box, ThemedText } from '@src/shared/components'
import { theme } from '@src/shared/constants/theme'

import { BlockedUserItem } from '../components/blocked-user-item.component'
import { useBlockActions } from '../hooks/use-block-actions'
import { useInfiniteBlockedUsers } from '../hooks/use-blocked-users'

export const BlockedUsersScreen = () => {
  const { unblockUser } = useBlockActions({ queryKeySuffix: 'infinite' })

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteBlockedUsers()

  const allBlockedUsers = data?.pages.flatMap((page) => page.data) ?? []

  const renderItem = ({ item, index }: { item: ListBlockedUsersResponse; index: number }) => (
    <BlockedUserItem item={item} index={index} totalItems={allBlockedUsers.length} onUnblock={unblockUser} />
  )

  return (
    <ScrollView style={styles.scroll}>
      <FlatList
        data={allBlockedUsers}
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
              <ThemedText color="textSecondary">Nenhum usuário bloqueado</ThemedText>
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

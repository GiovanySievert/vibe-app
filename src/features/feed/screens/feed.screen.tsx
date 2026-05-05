import React from 'react'
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useAtomValue } from 'jotai'

import { authStateAtom } from '@src/features/auth/state/auth.state'
import { Box } from '@src/shared/components/box'
import { Screen } from '@src/shared/components/screen'
import { ThemedText } from '@src/shared/components/themed-text'
import { theme } from '@src/shared/constants/theme'

import { FeedReviewCard, FeedSuggestions, FeedTrending } from '../components'
import { FeedReviewItem } from '../domain/feed-review-item.model'
import { useFeed } from '../hooks'

export const FeedScreen = () => {
  const { data, isPending, isRefetching, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } = useFeed()
  const authState = useAtomValue(authStateAtom)
  const insets = useSafeAreaInsets()

  const items = data?.pages.flatMap((page) => page) ?? []

  return (
    <Screen>
      <Box pl={4} pr={4} pt={5} pb={4}>
        <ThemedText variant="title">vibes</ThemedText>
        <ThemedText variant="mono" style={styles.subtitle}>
          {new Date().toLocaleDateString('pt-BR', { weekday: 'short' })} ·{' '}
          {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </ThemedText>
      </Box>

      {isPending ? (
        <Box flex={1} alignItems="center" justifyContent="center">
          <ActivityIndicator color={theme.colors.primary} />
        </Box>
      ) : (
        <FlatList<FeedReviewItem>
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <FeedReviewCard item={item} currentUserId={authState.user.id} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 84 }}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={theme.colors.primary} />
          }
          ItemSeparatorComponent={() => <Box style={styles.separator} ml={4} mr={4} mb={7} />}
          onEndReached={() => { if (hasNextPage && !isFetchingNextPage) fetchNextPage() }}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            isFetchingNextPage ? (
              <Box alignItems="center" pt={4} pb={4}>
                <ActivityIndicator color={theme.colors.primary} />
              </Box>
            ) : (
              <FeedTrending />
            )
          }
          ListEmptyComponent={<FeedSuggestions />}
        />
      )}
    </Screen>
  )
}

const styles = StyleSheet.create({
  subtitle: { marginTop: 4 },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.border
  }
})

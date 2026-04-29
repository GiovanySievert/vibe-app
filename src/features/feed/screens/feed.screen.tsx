import React from 'react'
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Box } from '@src/shared/components/box'
import { Screen } from '@src/shared/components/screen'
import { ThemedText } from '@src/shared/components/themed-text'
import { theme } from '@src/shared/constants/theme'

import { FeedReviewCard } from '../components'
import { FeedReviewItem } from '../domain/feed-review-item.model'
import { useFeed } from '../hooks'

export const FeedScreen = () => {
  const { data, isPending, isRefetching, refetch } = useFeed()
  const insets = useSafeAreaInsets()

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
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <FeedReviewCard item={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 84 }}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={theme.colors.primary} />
          }
          ItemSeparatorComponent={() => <Box style={styles.separator} ml={4} mr={4} mb={7} />}
          ListEmptyComponent={
            <Box flex={1} alignItems="center" justifyContent="center" pt={10}>
              <ThemedText variant="secondary">Nenhuma review nas últimas 24h</ThemedText>
            </Box>
          }
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

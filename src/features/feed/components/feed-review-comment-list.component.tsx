import React from 'react'
import { ActivityIndicator, FlatList } from 'react-native'

import { useInfiniteQuery } from '@tanstack/react-query'

import { Box, ThemedText } from '@src/shared/components'
import { theme } from '@src/shared/constants/theme'

import { FeedService } from '../services'
import { FeedReviewCommentItem } from './feed-review-comment-item.component'

type Props = {
  reviewId: string
  visible: boolean
  onTotalChange: (total: number) => void
}

export const FeedReviewCommentList: React.FC<Props> = ({ reviewId, visible, onTotalChange }) => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['feedReviewComments', reviewId],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await FeedService.listComments(reviewId, pageParam as number)
      return response.data
    },
    getNextPageParam: (lastPage, pages) => (lastPage.hasMore ? pages.length + 1 : undefined),
    initialPageParam: 1,
    enabled: visible
  })

  const comments = data?.pages.flatMap((page) => page.data) ?? []
  const total = data?.pages[0]?.total ?? comments.length

  React.useEffect(() => {
    onTotalChange(total)
  }, [total])

  if (isLoading) {
    return (
      <Box flex={1} alignItems="center" justifyContent="center">
        <ActivityIndicator color={theme.colors.primary} />
      </Box>
    )
  }

  return (
    <FlatList
      data={comments}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <FeedReviewCommentItem item={item} />}
      showsVerticalScrollIndicator={false}
      onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
      onEndReachedThreshold={0.3}
      ListEmptyComponent={
        <Box pt={6}>
          <ThemedText size="sm" color="textTertiary">
            Nenhum comentário ainda.
          </ThemedText>
        </Box>
      }
      ListFooterComponent={
        isFetchingNextPage ? (
          <Box pt={3} pb={3}>
            <ActivityIndicator color={theme.colors.primary} />
          </Box>
        ) : null
      }
    />
  )
}

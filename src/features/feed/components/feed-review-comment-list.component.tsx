import React from 'react'
import { ActivityIndicator, FlatList } from 'react-native'

import { useInfiniteQuery } from '@tanstack/react-query'

import { Box, ThemedText } from '@src/shared/components'
import { theme } from '@src/shared/constants/theme'
import { useAppTranslation } from '@src/shared/i18n'

import { FeedService } from '../services'
import { FeedReviewCommentItem } from './feed-review-comment-item.component'

type Props = {
  reviewId: string
  visible: boolean
  commentsCount: number
  currentUserId: string
  reviewOwnerId: string
  onTotalChange: (total: number) => void
}

export const FeedReviewCommentList: React.FC<Props> = ({
  reviewId,
  visible,
  commentsCount,
  currentUserId,
  reviewOwnerId,
  onTotalChange
}) => {
  const { t } = useAppTranslation()
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['feedReviewComments', reviewId],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await FeedService.listComments(reviewId, pageParam as number)
      return response.data
    },
    getNextPageParam: (lastPage, pages) => (lastPage.hasMore ? pages.length + 1 : undefined),
    initialPageParam: 1,
    enabled: visible && (commentsCount === -1 || commentsCount > 0)
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
      renderItem={({ item }) => (
        <FeedReviewCommentItem item={item} currentUserId={currentUserId} reviewOwnerId={reviewOwnerId} />
      )}
      showsVerticalScrollIndicator={false}
      onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
      onEndReachedThreshold={0.3}
      ListEmptyComponent={
        <Box pt={6}>
          <ThemedText size="sm" color="textSecondary">
            {t('feed.comments.empty')}
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

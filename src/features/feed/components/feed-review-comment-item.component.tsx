import React from 'react'
import { Alert, StyleSheet } from 'react-native'

import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query'

import { Avatar, Box, ThemedText, Touchable } from '@src/shared/components'
import { ThemedIcon } from '@src/shared/components/themed-icon'
import { useNavigateToProfile } from '@src/shared/hooks'
import { useAppTranslation } from '@src/shared/i18n'
import { formatRelativeTime, HIT_SLOP } from '@src/shared/utils'

import { FeedReviewComment, ListFeedReviewCommentsResponse } from '../domain'
import { FeedService } from '../services'

type Props = {
  item: FeedReviewComment
  currentUserId: string
  reviewOwnerId: string
}

type CommentsCache = InfiniteData<ListFeedReviewCommentsResponse>

export const FeedReviewCommentItem: React.FC<Props> = ({ item, currentUserId, reviewOwnerId }) => {
  const { t } = useAppTranslation()
  const navigateToProfile = useNavigateToProfile()
  const queryClient = useQueryClient()
  const canDelete = item.userId === currentUserId || reviewOwnerId === currentUserId
  const queryKey = ['feedReviewComments', item.reviewId]

  const { mutate: deleteComment } = useMutation({
    mutationFn: () => FeedService.deleteComment(item.reviewId, item.id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<CommentsCache>(queryKey)
      queryClient.setQueryData<CommentsCache>(queryKey, (old) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.filter((c) => c.id !== item.id),
            total: page.total - 1
          }))
        }
      })
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    }
  })

  const handleDelete = () => {
    Alert.alert(t('feed.comments.deleteTitle'), t('feed.comments.deleteMsg'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('feed.comments.deleteBtn'),
        style: 'destructive',
        onPress: () => deleteComment()
      }
    ])
  }

  return (
    <Box flexDirection="row" gap={3} mb={4}>
      <Avatar size="xs" uri={item.user.image} placeholderIcon="User" onPress={() => navigateToProfile(item.user.id)} />
      <Box flex={1} gap={1}>
        <Box flexDirection="row" alignItems="center" gap={2} style={styles.commentMeta}>
          <ThemedText size="sm" weight="semibold" color="textPrimary">
            {item.user.username}
          </ThemedText>
          <ThemedText size="xs" color="textSecondary">
            {formatRelativeTime(item.createdAt)}
          </ThemedText>
        </Box>
        <ThemedText size="sm" color="textSecondary">
          {item.content}
        </ThemedText>
      </Box>
      {canDelete && (
        <Touchable
          onPress={handleDelete}
          hitSlop={HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel={t('feed.comments.deleteLabel')}
        >
          <ThemedIcon name="Trash2" size={14} color="textSecondary" />
        </Touchable>
      )}
    </Box>
  )
}

const styles = StyleSheet.create({
  commentMeta: {
    flexWrap: 'wrap'
  }
})

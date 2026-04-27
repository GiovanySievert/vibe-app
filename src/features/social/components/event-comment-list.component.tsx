import React from 'react'
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity } from 'react-native'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useToast } from '@src/app/providers'
import { Avatar, Box, ThemedText } from '@src/shared/components'
import { ThemedIcon } from '@src/shared/components/themed-icon'
import { theme } from '@src/shared/constants/theme'
import { formatRelativeTime, HIT_SLOP } from '@src/shared/utils'

import { EventCommentResponse, EventCommentService, ListEventCommentsResponse } from '../services/event-comment.service'

type InfiniteData = { pages: ListEventCommentsResponse[]; pageParams: unknown[] }

type EventCommentListProps = {
  eventId: string
  eventOwnerId: string
  currentUserId: string
  comments: EventCommentResponse[]
  isLoading: boolean
  total: number
  hasNextPage: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => void
}

export const EventCommentList: React.FC<EventCommentListProps> = ({
  eventId,
  eventOwnerId,
  currentUserId,
  comments,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage
}) => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  const { mutate: deleteComment } = useMutation({
    mutationFn: (commentId: string) => EventCommentService.delete(eventId, commentId),
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey: ['eventComments', eventId] })
      const previous = queryClient.getQueryData<InfiniteData>(['eventComments', eventId])

      queryClient.setQueryData<InfiniteData>(['eventComments', eventId], (old) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.filter((c) => c.id !== commentId),
            total: Math.max(0, page.total - 1)
          }))
        }
      })

      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['eventComments', eventId], context.previous)
      }
      showToast('não foi possível excluir o recado.', 'error')
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['eventComments', eventId] })
  })

  const renderComment = ({ item }: { item: EventCommentResponse }) => {
    const isCreator = item.userId === eventOwnerId
    const canDelete = item.userId === currentUserId || currentUserId === eventOwnerId

    return (
      <Box mb={4}>
        <Box flexDirection="row" gap={3} alignItems="center">
          <Avatar size="xs" uri={item.avatar} />
          <Box flex={1} gap={1}>
            <Box flexDirection="row" alignItems="center" gap={2}>
              <ThemedText size="sm" weight="semibold">
                {item.username}
              </ThemedText>
              {isCreator && (
                <Box style={styles.creatorBadge}>
                  <ThemedText size="xs" color="primary" weight="semibold">
                    Criador
                  </ThemedText>
                </Box>
              )}
              <ThemedText size="xs" color="textTertiary">
                {formatRelativeTime(item.createdAt)}
              </ThemedText>
            </Box>
            <ThemedText size="sm" color="textSecondary">
              {item.content}
            </ThemedText>
          </Box>
          {canDelete && (
            <Box>
              <TouchableOpacity onPress={() => deleteComment(item.id)} hitSlop={HIT_SLOP}>
                <ThemedIcon name="Trash2" size={16} color="textTertiary" />
              </TouchableOpacity>
            </Box>
          )}
        </Box>
      </Box>
    )
  }

  if (!isLoading && comments.length === 0) {
    return (
      <ThemedText size="sm" color="textTertiary">
        Nenhum recado ainda. Seja o primeiro!
      </ThemedText>
    )
  }

  return (
    <FlatList
      data={comments}
      keyExtractor={(item) => item.id}
      renderItem={renderComment}
      scrollEnabled={false}
      onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
      onEndReachedThreshold={0.3}
      ListFooterComponent={isFetchingNextPage ? <ActivityIndicator color={theme.colors.primary} /> : null}
    />
  )
}

const styles = StyleSheet.create({
  creatorBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    backgroundColor: theme.colors.primaryGlow,
    borderWidth: 1,
    borderColor: theme.colors.primary
  }
})

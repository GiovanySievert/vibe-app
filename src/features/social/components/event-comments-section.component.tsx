import React, { useState } from 'react'
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity } from 'react-native'

import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { useToast } from '@src/app/providers'
import { authClient } from '@src/services/api/auth-client'
import { Avatar, Box, Divider, Input, ThemedText } from '@src/shared/components'
import { ThemedIcon } from '@src/shared/components/themed-icon'
import { theme } from '@src/shared/constants/theme'

import { EventCommentResponse, ListEventCommentsResponse, EventCommentService } from '../services/event-comment.service'

type InfiniteData = { pages: ListEventCommentsResponse[]; pageParams: unknown[] }

type EventCommentsSectionProps = {
  eventId: string
  eventOwnerId: string
  currentUserId: string
}

const formatRelativeTime = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'agora'
  if (minutes < 60) return `${minutes}min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  return `${days}d`
}

export const EventCommentsSection: React.FC<EventCommentsSectionProps> = ({
  eventId,
  eventOwnerId,
  currentUserId
}) => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const { data: session } = authClient.useSession()
  const [content, setContent] = useState('')

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['eventComments', eventId],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await EventCommentService.list(eventId, pageParam as number)
      return res.data
    },
    getNextPageParam: (lastPage, allPages) => (lastPage.hasMore ? allPages.length + 1 : undefined),
    initialPageParam: 1
  })

  const { mutate: postComment } = useMutation({
    mutationFn: () => EventCommentService.create(eventId, content.trim()),
    onMutate: async () => {
      const text = content.trim()
      setContent('')
      await queryClient.cancelQueries({ queryKey: ['eventComments', eventId] })
      const previous = queryClient.getQueryData<InfiniteData>(['eventComments', eventId])

      const optimistic: EventCommentResponse = {
        id: `temp-${Date.now()}`,
        eventId,
        userId: currentUserId,
        username: session?.user.name ?? '',
        avatar: session?.user.image ?? null,
        content: text,
        createdAt: new Date().toISOString()
      }

      queryClient.setQueryData<InfiniteData>(['eventComments', eventId], (old) => {
        if (!old) return old
        const [first, ...rest] = old.pages
        return {
          ...old,
          pages: [
            { ...first, data: [optimistic, ...first.data], total: first.total + 1 },
            ...rest
          ]
        }
      })

      return { previous }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventComments', eventId] })
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['eventComments', eventId], context.previous)
      }
      showToast('Não foi possível postar o recado.', 'error')
    }
  })

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
      showToast('Não foi possível excluir o recado.', 'error')
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['eventComments', eventId] })
  })

  const comments = data?.pages.flatMap((p) => p.data) ?? []

  const renderComment = ({ item }: { item: EventCommentResponse }) => {
    const isCreator = item.userId === eventOwnerId
    const canDelete = item.userId === currentUserId || currentUserId === eventOwnerId

    return (
      <Box mb={4}>
        <Box flexDirection="row" gap={3} alignItems="flex-start">
          <Avatar size="sm" uri={item.avatar} />
          <Box flex={1} gap={1}>
            <Box flexDirection="row" alignItems="center" gap={2}>
              <ThemedText size="sm" weight="semibold">{item.username}</ThemedText>
              {isCreator && (
                <Box style={styles.creatorBadge}>
                  <ThemedText size="xs" color="primary" weight="semibold">Criador</ThemedText>
                </Box>
              )}
              <ThemedText size="xs" color="textTertiary">{formatRelativeTime(item.createdAt)}</ThemedText>
            </Box>
            <ThemedText size="sm" color="textSecondary">{item.content}</ThemedText>
          </Box>
          {canDelete && (
            <TouchableOpacity onPress={() => deleteComment(item.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <ThemedIcon name="Trash2" size={14} color="textTertiary" />
            </TouchableOpacity>
          )}
        </Box>
      </Box>
    )
  }

  return (
    <Box gap={3}>
      <Divider />
      <ThemedText size="sm" color="textSecondary" weight="semibold">
        Recados {comments.length > 0 ? `(${data?.pages[0].total})` : ''}
      </ThemedText>

      {!isLoading && comments.length === 0 ? (
        <ThemedText size="sm" color="textTertiary">Nenhum recado ainda. Seja o primeiro!</ThemedText>
      ) : (
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={renderComment}
          scrollEnabled={false}
          onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            isFetchingNextPage ? <ActivityIndicator color={theme.colors.primary} /> : null
          }
        />
      )}

      <Box flexDirection="row" gap={2} alignItems="center">
        <Box flex={1}>
          <Input
            placeholder="Deixe um recado..."
            value={content}
            onChangeText={setContent}
            maxLength={500}
          />
        </Box>
        <TouchableOpacity
          onPress={() => content.trim() && postComment()}
          disabled={!content.trim()}
          style={[styles.sendButton, !content.trim() && styles.sendButtonDisabled]}
        >
          <ThemedIcon name="Send" size={18} color="background" />
        </TouchableOpacity>
      </Box>
    </Box>
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
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendButtonDisabled: {
    opacity: 0.5
  }
})

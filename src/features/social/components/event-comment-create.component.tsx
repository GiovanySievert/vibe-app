import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useToast } from '@src/app/providers'
import { authClient } from '@src/services/api/auth-client'
import { Box, Input } from '@src/shared/components'
import { ThemedIcon } from '@src/shared/components/themed-icon'
import { theme } from '@src/shared/constants/theme'

import { EventCommentResponse, EventCommentService, ListEventCommentsResponse } from '../services/event-comment.service'

type InfiniteData = { pages: ListEventCommentsResponse[]; pageParams: unknown[] }

type EventCommentCreateProps = {
  eventId: string
  currentUserId: string
}

export const EventCommentCreate: React.FC<EventCommentCreateProps> = ({ eventId, currentUserId }) => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const { data: session } = authClient.useSession()
  const [content, setContent] = useState('')

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
          pages: [{ ...first, data: [optimistic, ...first.data], total: first.total + 1 }, ...rest]
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
      showToast('não foi possível postar o recado.', 'error')
    }
  })

  return (
    <Box flexDirection="row" gap={2} alignItems="center">
      <Box flex={1}>
        <Input value={content} onChangeText={setContent} maxLength={500} />
      </Box>
      <TouchableOpacity
        onPress={() => content.trim() && postComment()}
        disabled={!content.trim()}
        style={[styles.sendButton, !content.trim() && styles.sendButtonDisabled]}
      >
        <ThemedIcon name="Send" size={18} color="background" />
      </TouchableOpacity>
    </Box>
  )
}

const styles = StyleSheet.create({
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

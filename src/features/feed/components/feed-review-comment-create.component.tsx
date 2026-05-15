import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query'

import { useToast } from '@src/app/providers/toast.provider'
import { authClient } from '@src/services/api/auth-client'
import { Box, Input, ThemedIcon } from '@src/shared/components'
import { theme } from '@src/shared/constants/theme'
import { triggerLightHaptic } from '@src/shared/utils'

import { FeedReviewComment, ListFeedReviewCommentsResponse } from '../domain'
import { FeedService } from '../services'

type Props = {
  reviewId: string
}

export const FeedReviewCommentCreate: React.FC<Props> = ({ reviewId }) => {
  const { data: session } = authClient.useSession()
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const [content, setContent] = useState('')

  const { mutate: createComment } = useMutation({
    mutationFn: (nextContent: string) => FeedService.createComment(reviewId, nextContent),
    onMutate: async (nextContent) => {
      const trimmedContent = nextContent.trim()
      setContent('')

      await queryClient.cancelQueries({ queryKey: ['feedReviewComments', reviewId] })

      const previousComments = queryClient.getQueryData<InfiniteData<ListFeedReviewCommentsResponse>>([
        'feedReviewComments',
        reviewId
      ])
      const optimisticComment: FeedReviewComment = {
        id: `temp-${Date.now()}`,
        reviewId,
        userId: session?.user.id ?? 'me',
        content: trimmedContent,
        createdAt: new Date().toISOString(),
        user: {
          id: session?.user.id ?? 'me',
          username: session?.user.name ?? 'Você',
          image: session?.user.image ?? null
        }
      }

      queryClient.setQueryData<InfiniteData<ListFeedReviewCommentsResponse>>(
        ['feedReviewComments', reviewId],
        (old) => {
          if (!old) {
            return {
              pages: [{ data: [optimisticComment], total: 1, hasMore: false }],
              pageParams: [1]
            }
          }

          const [firstPage, ...restPages] = old.pages

          return {
            ...old,
            pages: [
              {
                ...firstPage,
                data: [optimisticComment, ...firstPage.data],
                total: firstPage.total + 1
              },
              ...restPages
            ]
          }
        }
      )

      return { previousComments }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(['feedReviewComments', reviewId], context.previousComments)
      } else {
        queryClient.removeQueries({ queryKey: ['feedReviewComments', reviewId], exact: true })
      }

      showToast('não foi possível comentar essa review.', 'error')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['feedReviewComments', reviewId] })
      queryClient.invalidateQueries({ queryKey: ['feed'] })
    }
  })

  const handleCreateComment = () => {
    const trimmedContent = content.trim()

    if (!trimmedContent) {
      return
    }

    triggerLightHaptic()
    createComment(trimmedContent)
  }

  return (
    <Box flexDirection="row" gap={2} alignItems="center" mb={4}>
      <Box flex={1}>
        <Input value={content} onChangeText={setContent} maxLength={500} />
      </Box>
      <TouchableOpacity
        onPress={handleCreateComment}
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
    borderRadius: 10,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendButtonDisabled: {
    opacity: 0.5
  }
})

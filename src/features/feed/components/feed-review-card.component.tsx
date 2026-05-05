import React, { useState } from 'react'
import { Alert, Share, StyleSheet, TouchableOpacity } from 'react-native'

import * as ExpoLinking from 'expo-linking'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useToast } from '@src/app/providers'
import { Avatar } from '@src/shared/components/avatar'
import { Box } from '@src/shared/components/box'
import { ThemedIcon } from '@src/shared/components/themed-icon'
import { ThemedText } from '@src/shared/components/themed-text'
import { theme } from '@src/shared/constants/theme'
import { formatRelativeTime } from '@src/shared/utils'

import { FeedReviewItem } from '../domain/feed-review-item.model'
import { FeedService } from '../services'
import { DualPhoto } from './dual-photo.component'
import { FeedReviewCommentsModal } from './feed-review-comments-modal.component'

type Props = {
  item: FeedReviewItem
  currentUserId: string
  hideComments?: boolean
}

export const FeedReviewCard: React.FC<Props> = ({ item, currentUserId, hideComments = false }) => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const [isCommentsVisible, setIsCommentsVisible] = useState(false)
  const relativeTime = formatRelativeTime(item.createdAt)
  const isOwner = item.userId === currentUserId

  const { mutate: submitReaction } = useMutation({
    mutationFn: (nextReaction: 'on' | 'off' | null) => {
      if (nextReaction === null) {
        return FeedService.removeReaction(item.id)
      }

      return FeedService.setReaction(item.id, nextReaction)
    },
    onMutate: async (nextReaction) => {
      await queryClient.cancelQueries({ queryKey: ['feed'] })
      const previousFeed = queryClient.getQueriesData<{ pages: FeedReviewItem[][] }>({ queryKey: ['feed'] })

      queryClient.setQueriesData<{ pages: FeedReviewItem[][] }>({ queryKey: ['feed'] }, (old) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page) =>
            page.map((review) => {
              if (review.id !== item.id) return review
              const previousReaction = review.viewerReaction
              return {
                ...review,
                viewerReaction: nextReaction,
                onCount: review.onCount + (nextReaction === 'on' ? 1 : 0) - (previousReaction === 'on' ? 1 : 0),
                offCount: review.offCount + (nextReaction === 'off' ? 1 : 0) - (previousReaction === 'off' ? 1 : 0)
              }
            })
          )
        }
      })

      return { previousFeed }
    },
    onError: (_error, _variables, context) => {
      context?.previousFeed?.forEach(([queryKey, value]) => {
        queryClient.setQueryData(queryKey, value)
      })

      showToast('não foi possível atualizar sua reação.', 'error')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] })
    }
  })

  const { mutate: deleteReview } = useMutation({
    mutationFn: () => FeedService.deleteReview(item.id),
    onSuccess: () => {
      queryClient.setQueriesData<{ pages: FeedReviewItem[][] }>({ queryKey: ['feed'] }, (old) => {
        if (!old) return old
        return { ...old, pages: old.pages.map((page) => page.filter((r) => r.id !== item.id)) }
      })
      showToast('review excluída.', 'success')
    },
    onError: () => {
      showToast('não foi possível excluir a review.', 'error')
    }
  })

  const handleReactionPress = (type: 'on' | 'off') => {
    submitReaction(item.viewerReaction === type ? null : type)
  }

  const handleShare = () => {
    const url = ExpoLinking.createURL(`reviews/share/${item.id}`)
    Share.share({ message: `${item.user.username} avaliou ${item.place.name} no vibes\n${url}` })
  }

  const handleMenuPress = () => {
    Alert.alert('', '', [
      {
        text: 'Excluir review',
        style: 'destructive',
        onPress: () => deleteReview()
      },
      { text: 'Cancelar', style: 'cancel' }
    ])
  }

  return (
    <>
      <Box pl={4} pr={4} pb={7}>
        <Box flexDirection="row" alignItems="center" gap={3} mb={3}>
          <Avatar size="xs" uri={item.user.image} />
          <Box flexDirection="row" alignItems="center" gap={2} flex={1}>
            <ThemedText weight="semibold" size="sm" color="textPrimary">
              {item.user.username}
            </ThemedText>
            {isOwner && (
              <Box style={styles.ownerBadge}>
                <ThemedText size="xs" color="textSecondary" style={styles.ownerBadgeText}>
                  você
                </ThemedText>
              </Box>
            )}
          </Box>
          <Box flex={1}>
            <ThemedText variant="mono">
              {relativeTime} · {item.place.name}
            </ThemedText>
          </Box>
          {isOwner && (
            <TouchableOpacity activeOpacity={0.7} onPress={handleMenuPress} style={styles.menuBtn}>
              <ThemedIcon name="Ellipsis" size={18} color="textSecondary" />
            </TouchableOpacity>
          )}
        </Box>

        <DualPhoto placeImageUrl={item.placeImageUrl} selfieUrl={item.selfieUrl} placeName={item.place.name} />

        {item.comment && (
          <ThemedText size="sm" color="textPrimary" style={styles.caption}>
            {item.comment}
          </ThemedText>
        )}

        <Box flexDirection="row" alignItems="center" gap={4} mt={3}>
          <TouchableOpacity activeOpacity={0.7} style={styles.voteBtn} onPress={() => handleReactionPress('on')}>
            <Box style={[styles.dot, item.viewerReaction === 'on' ? styles.dotActive : styles.dotInactive]} />
            <ThemedText size="xs" weight="medium" color={item.viewerReaction === 'on' ? 'primary' : 'textSecondary'}>
              on · {item.onCount}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} style={styles.voteBtn} onPress={() => handleReactionPress('off')}>
            <Box style={[styles.dot, item.viewerReaction === 'off' ? styles.dotActiveOff : styles.dotInactive]} />
            <ThemedText size="xs" weight="medium" color={item.viewerReaction === 'off' ? 'warning' : 'textSecondary'}>
              off · {item.offCount}
            </ThemedText>
          </TouchableOpacity>

          {!hideComments && (
            <TouchableOpacity activeOpacity={0.7} style={styles.actionBtn} onPress={() => setIsCommentsVisible(true)}>
              <ThemedIcon name="MessageCircle" size={16} color="textSecondary" />
              <ThemedText size="xs" weight="medium" color="textSecondary">
                comentários · {item.commentsCount}
              </ThemedText>
            </TouchableOpacity>
          )}

          <TouchableOpacity activeOpacity={0.7} style={styles.actionBtn} onPress={handleShare}>
            <ThemedIcon name="Share2" size={16} color="textSecondary" />
          </TouchableOpacity>
        </Box>
      </Box>
      {!hideComments && (
        <FeedReviewCommentsModal
          reviewId={item.id}
          visible={isCommentsVisible}
          onClose={() => setIsCommentsVisible(false)}
        />
      )}
    </>
  )
}

const styles = StyleSheet.create({
  caption: {
    marginTop: 14,
    lineHeight: 20,
    letterSpacing: -0.1
  },
  voteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dotActive: {
    borderColor: theme.colors.primary
  },
  dotActiveOff: {
    borderColor: theme.colors.warning
  },
  dotInactive: {
    borderColor: theme.colors.border
  },
  ownerBadge: {
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: theme.colors.backgroundSecondary
  },
  ownerBadgeText: {
    lineHeight: 14
  },
  menuBtn: {
    padding: 4
  }
})

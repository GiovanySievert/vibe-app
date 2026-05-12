import React, { useEffect, useState } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

import { NavigationProp, useNavigation } from '@react-navigation/native'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useToast } from '@src/app/providers'
import { AuthenticatedStackParamList } from '@src/app/navigation/types'
import { Avatar } from '@src/shared/components/avatar'
import { Box } from '@src/shared/components/box'
import { ThemedIcon } from '@src/shared/components/themed-icon'
import { ThemedText } from '@src/shared/components/themed-text'
import { theme } from '@src/shared/constants/theme'
import { formatRelativeTime } from '@src/shared/utils'

import { FeedReviewItem, ReviewCounts } from '../domain/feed-review-item.model'
import { FeedService } from '../services'
import { DualPhoto } from './dual-photo.component'
import { FeedReviewCommentsModal } from './feed-review-comments-modal.component'
import { ReviewCardMenu } from './review-card-menu.component'

type Props = {
  review: FeedReviewItem
  currentUserId: string
}

export const ReviewCard: React.FC<Props> = ({ review, currentUserId }) => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const navigation = useNavigation<NavigationProp<AuthenticatedStackParamList>>()
  const [isCommentsVisible, setIsCommentsVisible] = useState(false)
  const [counts, setCounts] = useState<ReviewCounts | null>(null)
  const relativeTime = formatRelativeTime(review.createdAt)
  const isOwner = review.userId === currentUserId

  useEffect(() => {
    FeedService.getCounts(review.id)
      .then((r) => setCounts(r.data))
      .catch(() => {})
  }, [review.id])

  const { mutate: submitReaction } = useMutation({
    mutationFn: (nextReaction: 'on' | 'off' | null) => {
      if (nextReaction === null) return FeedService.removeReaction(review.id)
      return FeedService.setReaction(review.id, nextReaction)
    },
    onMutate: async (nextReaction) => {
      const previousCounts = counts
      setCounts((prev) => {
        if (!prev) return prev
        const previousReaction = prev.viewerReaction
        return {
          ...prev,
          viewerReaction: nextReaction,
          onCount: prev.onCount + (nextReaction === 'on' ? 1 : 0) - (previousReaction === 'on' ? 1 : 0),
          offCount: prev.offCount + (nextReaction === 'off' ? 1 : 0) - (previousReaction === 'off' ? 1 : 0)
        }
      })
      return { previousCounts }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousCounts !== undefined) setCounts(context.previousCounts)
      showToast('não foi possível atualizar sua reação.', 'error')
    },
    onSettled: () => {
      FeedService.getCounts(review.id)
        .then((r) => setCounts(r.data))
        .catch(() => {})
      queryClient.invalidateQueries({ queryKey: ['feed'] })
    }
  })

  const handleReactionPress = (type: 'on' | 'off') => {
    submitReaction(counts?.viewerReaction === type ? null : type)
  }

  return (
    <>
      <Box pl={4} pr={4} pb={7}>
        <Box flexDirection="row" alignItems="center" gap={3} mb={3}>
          <Avatar
            size="xs"
            uri={review.user.image}
            placeholderIcon="User"
            onPress={() => navigation.navigate('Modals', { screen: 'UsersProfileScreen', params: { userId: review.user.id } })}
          />
          <Box flexDirection="row" alignItems="center" gap={2} flex={1}>
            <ThemedText weight="semibold" size="sm" color="textPrimary">
              {review.user.username}
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
              {relativeTime} · {review.placeName}
            </ThemedText>
          </Box>
          <ReviewCardMenu review={review} isOwner={isOwner} />
        </Box>

        <DualPhoto placeImageUrl={review.placeImageUrl} selfieUrl={review.selfieUrl} placeName={review.placeName} />

        {review.comment && (
          <ThemedText size="sm" color="textPrimary" style={styles.caption}>
            {review.comment}
          </ThemedText>
        )}

        <Box flexDirection="row" alignItems="center" gap={4} mt={3}>
          <TouchableOpacity activeOpacity={0.7} style={styles.voteBtn} onPress={() => handleReactionPress('on')}>
            <Box style={[styles.dot, counts?.viewerReaction === 'on' ? styles.dotActive : styles.dotInactive]} />
            <ThemedText size="xs" weight="medium" color={counts?.viewerReaction === 'on' ? 'primary' : 'textSecondary'}>
              on · {counts?.onCount ?? 0}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} style={styles.voteBtn} onPress={() => handleReactionPress('off')}>
            <Box style={[styles.dot, counts?.viewerReaction === 'off' ? styles.dotActiveOff : styles.dotInactive]} />
            <ThemedText size="xs" weight="medium" color={counts?.viewerReaction === 'off' ? 'warning' : 'textSecondary'}>
              off · {counts?.offCount ?? 0}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} style={styles.actionBtn} onPress={() => setIsCommentsVisible(true)}>
            <ThemedIcon name="MessageCircle" size={16} color="textSecondary" />
            <ThemedText size="xs" weight="medium" color="textSecondary">
              comentários · {counts?.commentsCount ?? 0}
            </ThemedText>
          </TouchableOpacity>
        </Box>
      </Box>

      <FeedReviewCommentsModal
        reviewId={review.id}
        visible={isCommentsVisible}
        onClose={() => setIsCommentsVisible(false)}
      />
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
  }
})

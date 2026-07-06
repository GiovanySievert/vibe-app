import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useToast } from '@src/app/providers/toast.provider'
import { Touchable } from '@src/shared/components'
import { Avatar } from '@src/shared/components/avatar'
import { Box } from '@src/shared/components/box'
import { ThemedIcon } from '@src/shared/components/themed-icon'
import { ThemedText } from '@src/shared/components/themed-text'
import { theme } from '@src/shared/constants/theme'
import { useNavigateToProfile } from '@src/shared/hooks'
import { useAppTranslation } from '@src/shared/i18n'
import { formatRelativeTime, getAvatarImageUris, getReviewDetailImageUris, triggerLightHaptic } from '@src/shared/utils'

import { FeedReviewItem, ReviewCounts } from '../domain/feed-review-item.model'
import { FeedService } from '../services'
import { DualPhoto } from './dual-photo.component'
import { FeedReviewCommentsModal } from './feed-review-comments-modal.component'
import { ReviewCardMenu } from './review-card-menu.component'
import { ReviewInteractionsModal } from './review-interactions-modal.component'

type Props = {
  review: FeedReviewItem
  currentUserId: string
  enableFavoriteAction?: boolean
}

export const ReviewCard: React.FC<Props> = ({ review, currentUserId, enableFavoriteAction = false }) => {
  const { t } = useAppTranslation()
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const navigateToProfile = useNavigateToProfile()
  const [isCommentsVisible, setIsCommentsVisible] = useState(false)
  const [isInteractionsVisible, setIsInteractionsVisible] = useState(false)
  const [counts, setCounts] = useState<ReviewCounts | null>(null)
  const relativeTime = formatRelativeTime(review.createdAt)
  const isOwner = review.userId === currentUserId || review.isOwnAnonymous
  const avatarUris = review.user
    ? getAvatarImageUris(review.user)
    : { displayUri: null, fullUri: null }
  const detailImageUris = getReviewDetailImageUris(review)
  const displayName = review.isOwnAnonymous
    ? t('feed.card.anonymousYou')
    : review.isAnonymous
      ? t('feed.card.anonymous')
      : review.user?.username

  useEffect(() => {
    FeedService.getCounts(review.id)
      .then((r) => setCounts(r.data))
      .catch(() => {
        showToast(t('feed.errors.loadInteractionsFailed'), 'error')
      })
  }, [review.id, showToast, t])

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
      showToast(t('feed.errors.updateReactionFailed'), 'error')
    },
    onSettled: () => {
      FeedService.getCounts(review.id)
        .then((r) => setCounts(r.data))
        .catch(() => {
          showToast(t('feed.errors.updateInteractionsFailed'), 'error')
        })
      queryClient.invalidateQueries({ queryKey: ['feed'] })
    }
  })

  const handleReactionPress = (type: 'on' | 'off') => {
    triggerLightHaptic()
    submitReaction(counts?.viewerReaction === type ? null : type)
  }

  const totalComments = (counts?.onCount ?? 0) + (counts?.offCount ?? 0)

  return (
    <>
      <Box pl={4} pr={4} pb={7}>
        <Box flexDirection="row" alignItems="center" gap={3} mb={3}>
          <Avatar
            size="xs"
            uri={avatarUris.displayUri}
            fullUri={avatarUris.fullUri}
            placeholderIcon="User"
            onPress={review.isAnonymous || !review.user ? undefined : () => navigateToProfile(review.user!.id)}
          />
          <Box flexDirection="row" alignItems="center" gap={2} flex={1}>
            <ThemedText weight="semibold" size="sm" color="textPrimary">
              {displayName}
            </ThemedText>
            {isOwner && (
              <Box style={styles.ownerBadge}>
                <ThemedText size="xs" color="textSecondary" style={styles.ownerBadgeText}>
                  {t('feed.card.ownerBadge')}
                </ThemedText>
              </Box>
            )}
          </Box>
          <Box flex={1}>
            <ThemedText variant="mono">
              {relativeTime} · {review.placeName}
            </ThemedText>
          </Box>
          <ReviewCardMenu review={review} isOwner={isOwner} enableFavoriteAction={enableFavoriteAction} />
        </Box>

        <DualPhoto
          placeImageUrl={detailImageUris.placeImageUri}
          selfieUrl={detailImageUris.selfieUri}
          placeName={review.placeName}
        />

        {review.comment && (
          <ThemedText size="sm" color="textPrimary" style={styles.caption}>
            {review.comment}
          </ThemedText>
        )}

        <Box flexDirection="row" alignItems="center" gap={4} mt={3}>
          <Touchable activeOpacity={0.7} style={styles.voteBtn} onPress={() => handleReactionPress('on')}>
            <Box style={[styles.dot, counts?.viewerReaction === 'on' ? styles.dotActive : styles.dotInactive]} />
            <ThemedText size="xs" weight="medium" color={counts?.viewerReaction === 'on' ? 'primary' : 'textSecondary'}>
              on · {counts?.onCount ?? 0}
            </ThemedText>
          </Touchable>

          <Touchable activeOpacity={0.7} style={styles.voteBtn} onPress={() => handleReactionPress('off')}>
            <Box style={[styles.dot, counts?.viewerReaction === 'off' ? styles.dotActiveOff : styles.dotInactive]} />
            <ThemedText
              size="xs"
              weight="medium"
              color={counts?.viewerReaction === 'off' ? 'warning' : 'textSecondary'}
            >
              off · {counts?.offCount ?? 0}
            </ThemedText>
          </Touchable>

          <Touchable activeOpacity={0.7} style={styles.actionBtn} onPress={() => setIsCommentsVisible(true)}>
            <ThemedIcon name="MessageCircle" size={16} color="textSecondary" />
            <ThemedText size="xs" weight="medium" color="textSecondary">
              {t('feed.card.comments', { count: counts?.commentsCount ?? 0 })}
            </ThemedText>
          </Touchable>
        </Box>

        {isOwner && totalComments > 0 ? (
          <Touchable activeOpacity={0.7} onPress={() => setIsInteractionsVisible(true)} style={styles.interactionsBtn}>
            <ThemedText size="xs" color="primary">
              {t('feed.card.viewInteractions', { count: totalComments })}
            </ThemedText>
          </Touchable>
        ) : (
          <Box style={styles.interactionsBtn}>
            <ThemedText size="xs" color="textSecondary">
              {t('feed.card.noInteractions')}
            </ThemedText>
          </Box>
        )}
      </Box>

      <FeedReviewCommentsModal
        reviewId={review.id}
        visible={isCommentsVisible}
        commentsCount={counts?.commentsCount ?? 0}
        currentUserId={currentUserId}
        reviewOwnerId={review.userId ?? ''}
        onClose={() => setIsCommentsVisible(false)}
      />

      {isOwner && (
        <ReviewInteractionsModal
          reviewId={review.id}
          onCount={counts?.onCount ?? 0}
          offCount={counts?.offCount ?? 0}
          visible={isInteractionsVisible}
          onClose={() => setIsInteractionsVisible(false)}
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
  interactionsBtn: {
    marginTop: 10,
    alignSelf: 'flex-start'
  }
})

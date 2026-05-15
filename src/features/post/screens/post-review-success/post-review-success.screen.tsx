import React, { useEffect, useMemo, useRef } from 'react'
import { Pressable, StyleSheet } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { useQuery } from '@tanstack/react-query'
import { LinearGradient } from 'expo-linear-gradient'
import { useAtomValue } from 'jotai'

import { PostStackParamList } from '@src/app/navigation/types'
import { authStateAtom } from '@src/features/auth/state'
import { BadgesService } from '@src/features/users-profile/services'
import { Box, Button, ThemedIcon, ThemedText } from '@src/shared/components'
import { Screen } from '@src/shared/components/screen'
import { theme } from '@src/shared/constants/theme'
import { triggerBadgeUnlockHaptic } from '@src/shared/utils'

import { MilestonesFloatingCard } from './components/milestones-floating-card.component'
import { ProgressBlock } from './components/progress-block.component'
import { ReviewCountBadge } from './components/review-count-badge.component'

import { BADGE_MILESTONES, UNLOCKED_GRADIENT_COLORS, UNLOCKED_GRADIENT_LOCATIONS } from './constants'
import { useSuccessAnimations } from './use-success-animations'
import { useSuccessNavigation } from './use-success-navigation'

type Props = NativeStackScreenProps<PostStackParamList, 'PostReviewSuccess'>

export const PostReviewSuccessScreen: React.FC<Props> = ({ navigation, route }) => {
  const { placeId, placeName } = route.params
  const authState = useAtomValue(authStateAtom)
  const { closeToFeed, openBadges } = useSuccessNavigation({ navigation })
  const triggeredBadgeHapticKey = useRef<string | null>(null)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['userBadgeForPlace', authState.user.id, placeId],
    queryFn: async () => (await BadgesService.fetchUserBadgeForPlace(authState.user.id, placeId)).data,
    enabled: !!authState.user.id && !!placeId,
    retry: false
  })

  const reviewCount = data?.reviewCount ?? 0

  const unlockedMilestone = useMemo(
    () =>
      !isLoading && !isError
        ? (BADGE_MILESTONES.find((milestone) => milestone.minReviews === reviewCount) ?? null)
        : null,
    [isError, isLoading, reviewCount]
  )
  const hasUnlockedBadge = !!unlockedMilestone

  const progressState = useMemo(() => {
    const achieved = BADGE_MILESTONES.filter((milestone) => reviewCount >= milestone.minReviews)
    const current = achieved.length ? achieved[achieved.length - 1] : null
    const next = BADGE_MILESTONES.find((milestone) => reviewCount < milestone.minReviews) ?? null
    const targetMin = next?.minReviews ?? BADGE_MILESTONES[BADGE_MILESTONES.length - 1].minReviews
    const progress = next ? Math.min(Math.max(reviewCount / targetMin, 0), 1) : 1

    return {
      current,
      next,
      progress,
      remaining: next ? Math.max(next.minReviews - reviewCount, 0) : 0
    }
  }, [reviewCount])

  const { progressStyle, ringProps, milestonesStyle, showMilestones } = useSuccessAnimations({
    isLoading,
    hasUnlockedBadge,
    progress: progressState.progress,
    reviewCount
  })

  useEffect(() => {
    if (!hasUnlockedBadge || !unlockedMilestone) return
    const hapticKey = `${placeId}-${unlockedMilestone.tier}-${reviewCount}`
    if (triggeredBadgeHapticKey.current === hapticKey) return
    triggeredBadgeHapticKey.current = hapticKey
    triggerBadgeUnlockHaptic()
  }, [hasUnlockedBadge, placeId, reviewCount, unlockedMilestone])

  const progressText = hasUnlockedBadge
    ? progressState.next
      ? `"${progressState.next.label}" desbloqueia em ${progressState.next.minReviews} reviews`
      : 'badge máxima desbloqueada'
    : progressState.next
      ? `faltam ${progressState.remaining} pra "${progressState.next.label}"`
      : 'badge máxima desbloqueada'

  const reviewText = isLoading
    ? 'carregando progresso...'
    : hasUnlockedBadge
      ? `${reviewCount} reviews em ${placeName}`
      : `review #${reviewCount} · ${placeName}`

  const progressTarget = hasUnlockedBadge
    ? (unlockedMilestone?.minReviews ?? reviewCount)
    : (progressState.next?.minReviews ?? 20)

  const content = (
    <Box flex={1} p={5} style={styles.content}>
      <Box flexDirection="row" justifyContent="flex-end">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="fechar"
          onPress={closeToFeed}
          style={styles.closeButton}
        >
          <ThemedIcon name="X" size={20} color="textPrimary" />
        </Pressable>
      </Box>

      <Box flex={1} justifyContent="space-between">
        <Box gap={6}>
          <Box gap={3}>
            <ThemedText
              variant="mono"
              color={hasUnlockedBadge ? 'primary' : 'textSecondary'}
              letterSpacing="wider"
              textTransform="uppercase"
            >
              {hasUnlockedBadge ? 'badge desbloqueada' : 'review publicada'}
            </ThemedText>
            <ThemedText variant="title" letterSpacing="normal" style={styles.title}>
              {hasUnlockedBadge ? `${unlockedMilestone?.label ?? 'badge'} desbloqueado` : 'obrigado por compartilhar'}
            </ThemedText>
            <ThemedText variant="mono" color="textSecondary" size="sm" letterSpacing="normal">
              {reviewText}
            </ThemedText>
          </Box>

          <ReviewCountBadge
            reviewCount={reviewCount}
            hasUnlockedBadge={hasUnlockedBadge}
            isLoading={isLoading}
            ringProps={ringProps}
          />

          <ProgressBlock
            reviewCount={reviewCount}
            progressTarget={progressTarget}
            progressText={progressText}
            hasUnlockedBadge={hasUnlockedBadge}
            isLoading={isLoading}
            isError={isError}
            progressStyle={progressStyle}
          />
        </Box>

        <Button onPress={hasUnlockedBadge ? openBadges : closeToFeed}>
          <ThemedText weight="bold" color="background" letterSpacing="normal">
            {hasUnlockedBadge ? 'ver badges' : 'continuar'}
          </ThemedText>
        </Button>
      </Box>

      {showMilestones ? (
        <MilestonesFloatingCard reviewCount={reviewCount} progressState={progressState} style={milestonesStyle} />
      ) : null}
    </Box>
  )

  return (
    <Screen>
      {hasUnlockedBadge ? (
        <LinearGradient
          colors={UNLOCKED_GRADIENT_COLORS}
          locations={UNLOCKED_GRADIENT_LOCATIONS}
          start={{ x: 0.8, y: 0 }}
          end={{ x: 0.2, y: 1 }}
          style={styles.gradient}
        >
          {content}
        </LinearGradient>
      ) : (
        content
      )}
    </Screen>
  )
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: 'transparent'
  },
  gradient: {
    flex: 1
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.backgroundSecondary
  },
  title: {
    maxWidth: 320
  }
})

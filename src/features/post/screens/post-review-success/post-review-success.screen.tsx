import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useQuery } from '@tanstack/react-query'
import { LinearGradient } from 'expo-linear-gradient'
import { useAtomValue } from 'jotai'

import { PostStackParamList } from '@src/app/navigation/types'
import { authStateAtom } from '@src/features/auth/state'
import { BadgesService } from '@src/features/users-profile/services'
import { Box, Button, ThemedIcon, ThemedText } from '@src/shared/components'
import { Screen } from '@src/shared/components/screen'
import { theme } from '@src/shared/constants/theme'
import { useAppTranslation } from '@src/shared/i18n'
import { announce, triggerBadgeUnlockHaptic } from '@src/shared/utils'

import { MilestonesFloatingCard } from './components/milestones-floating-card.component'
import { ProgressBlock } from './components/progress-block.component'
import { ReviewCountBadge } from './components/review-count-badge.component'
import { StreakCelebrationStep } from './components/streak-celebration-step.component'

import { BADGE_MILESTONES, UNLOCKED_GRADIENT_COLORS, UNLOCKED_GRADIENT_LOCATIONS } from './constants'
import { useSuccessAnimations } from './use-success-animations'
import { useSuccessNavigation } from './use-success-navigation'

type Props = NativeStackScreenProps<PostStackParamList, 'PostReviewSuccess'>

export const PostReviewSuccessScreen: React.FC<Props> = ({ navigation, route }) => {
  const { t } = useAppTranslation()
  const { placeId, placeName, streakUpdate } = route.params
  const authState = useAtomValue(authStateAtom)
  const { closeToFeed, openBadges } = useSuccessNavigation({ navigation })
  const triggeredBadgeHapticKey = useRef<string | null>(null)
  const [step, setStep] = useState<'badge' | 'streak'>('badge')
  const hasTriggeredStreak = streakUpdate?.triggered === true

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
  const getBadgeLabel = (milestone?: { labelKey: string } | null) =>
    milestone ? t(milestone.labelKey) : t('post.badges.regular')

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
    announce(t('post.success.announce', { placeName }))
  }, [placeName, t])

  useEffect(() => {
    if (!hasUnlockedBadge || !unlockedMilestone) return
    const hapticKey = `${placeId}-${unlockedMilestone.tier}-${reviewCount}`
    if (triggeredBadgeHapticKey.current === hapticKey) return
    triggeredBadgeHapticKey.current = hapticKey
    triggerBadgeUnlockHaptic()
    announce(
      t('post.success.badgeUnlocked', {
        label: getBadgeLabel(unlockedMilestone)
      })
    )
  }, [hasUnlockedBadge, placeId, reviewCount, t, unlockedMilestone])

  const progressText = hasUnlockedBadge
    ? progressState.next
      ? t('post.success.nextBadge', {
          label: getBadgeLabel(progressState.next),
          minReviews: progressState.next.minReviews
        })
      : t('post.success.maxBadge')
    : progressState.next
      ? t('post.success.remainingBadge', {
          remaining: progressState.remaining,
          label: getBadgeLabel(progressState.next)
        })
      : t('post.success.maxBadge')

  const reviewText = isLoading
    ? t('post.success.loading')
    : hasUnlockedBadge
      ? t('post.success.reviewCount', { reviewCount, placeName })
      : t('post.success.reviewNumber', { reviewCount, placeName })

  const progressTarget = hasUnlockedBadge
    ? (unlockedMilestone?.minReviews ?? reviewCount)
    : (progressState.next?.minReviews ?? 20)

  const handlePrimaryAction = () => {
    if (hasTriggeredStreak) {
      setStep('streak')
      return
    }

    if (hasUnlockedBadge) {
      openBadges()
      return
    }

    closeToFeed()
  }

  const content = (
    <Box flex={1} p={5} style={styles.content}>
      <Box flexDirection="row" justifyContent="flex-end">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('common.close')}
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
              {hasUnlockedBadge ? t('post.success.badgeStatus') : t('post.success.reviewStatus')}
            </ThemedText>
            <ThemedText variant="title" letterSpacing="normal" style={styles.title}>
              {hasUnlockedBadge
                ? t('post.success.badgeTitle', {
                    label: getBadgeLabel(unlockedMilestone)
                  })
                : t('post.success.shareTitle')}
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

        <Button onPress={handlePrimaryAction}>
          <ThemedText weight="bold" color="background" letterSpacing="normal">
            {hasTriggeredStreak
              ? t('post.actions.continueBtn')
              : hasUnlockedBadge
                ? t('post.success.viewBadges')
                : t('post.actions.continueBtn')}
          </ThemedText>
        </Button>
      </Box>

      {showMilestones ? (
        <MilestonesFloatingCard reviewCount={reviewCount} progressState={progressState} style={milestonesStyle} />
      ) : null}
    </Box>
  )

  if (step === 'streak' && streakUpdate) {
    return (
      <View style={styles.gradientWrapper}>
        <LinearGradient
          colors={UNLOCKED_GRADIENT_COLORS}
          locations={UNLOCKED_GRADIENT_LOCATIONS}
          start={{ x: 0.8, y: 0 }}
          end={{ x: 0.2, y: 1 }}
          style={styles.gradient}
        >
          <SafeAreaView style={styles.safeArea} edges={['right', 'left', 'top']}>
            <StreakCelebrationStep streakUpdate={streakUpdate} onClose={closeToFeed} onContinue={closeToFeed} />
          </SafeAreaView>
        </LinearGradient>
      </View>
    )
  }

  if (hasUnlockedBadge) {
    return (
      <View style={styles.gradientWrapper}>
        <LinearGradient
          colors={UNLOCKED_GRADIENT_COLORS}
          locations={UNLOCKED_GRADIENT_LOCATIONS}
          start={{ x: 0.8, y: 0 }}
          end={{ x: 0.2, y: 1 }}
          style={styles.gradient}
        >
          <SafeAreaView style={styles.safeArea} edges={['right', 'left', 'top']}>
            {content}
          </SafeAreaView>
        </LinearGradient>
      </View>
    )
  }

  return <Screen>{content}</Screen>
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: 'transparent'
  },
  gradientWrapper: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  gradient: {
    flex: 1
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent'
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

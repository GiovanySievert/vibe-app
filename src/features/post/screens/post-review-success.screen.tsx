import React, { useEffect, useMemo } from 'react'
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native'
import { NavigationProp } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { PostStackParamList, TabsNavigatorParamsList } from '@src/app/navigation/types'
import { authStateAtom } from '@src/features/auth/state'
import { BadgesService, PlaceReviewBadgeTier } from '@src/features/users-profile/services'
import { Box, Button, ThemedIcon, ThemedText } from '@src/shared/components'
import { Screen } from '@src/shared/components/screen'
import { theme } from '@src/shared/constants/theme'

type Props = NativeStackScreenProps<PostStackParamList, 'PostReviewSuccess'>

type BadgeMilestone = {
  tier: PlaceReviewBadgeTier
  minReviews: number
  label: string
}

const BADGE_MILESTONES: BadgeMilestone[] = [
  { tier: 'regular', minReviews: 3, label: 'cliente' },
  { tier: 'fan', minReviews: 5, label: 'fã' },
  { tier: 'frequent', minReviews: 10, label: 'VIP' },
  { tier: 'legend', minReviews: 15, label: 'lenda' },
  { tier: 'king', minReviews: 20, label: 'rei' }
]

const space = (value: keyof typeof theme.spacing) => Number.parseFloat(theme.spacing[value])

export const PostReviewSuccessScreen: React.FC<Props> = ({ navigation, route }) => {
  const { placeId, placeName } = route.params
  const authState = useAtomValue(authStateAtom)
  const tabsNavigation = navigation.getParent<NavigationProp<TabsNavigatorParamsList>>()
  const progressWidth = useSharedValue(0)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['userBadgeForPlace', authState.user.id, placeId],
    queryFn: async () => (await BadgesService.fetchUserBadgeForPlace(authState.user.id, placeId)).data,
    enabled: !!authState.user.id && !!placeId,
    retry: false
  })

  const reviewCount = data?.reviewCount ?? 0

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

  useEffect(() => {
    progressWidth.value = 0
    if (isLoading) return

    progressWidth.value = withTiming(progressState.progress * 100, {
      duration: 900,
      easing: Easing.out(Easing.cubic)
    })
  }, [isLoading, progressState.progress, progressWidth])

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`
  }))

  const closeToFeed = () => {
    navigation.replace('PostMain')
    tabsNavigation?.navigate('FeedScreen')
  }

  const renderMilestone = (milestone: BadgeMilestone) => {
    const achieved = reviewCount >= milestone.minReviews
    const active = progressState.current?.tier === milestone.tier || (!progressState.current && progressState.next?.tier === milestone.tier)

    return (
      <Box key={milestone.tier} alignItems="center" gap={2} style={styles.milestone}>
        <View style={[styles.milestoneCircle, achieved && styles.milestoneCircleAchieved, active && styles.milestoneCircleActive]}>
          <ThemedText
            variant="mono"
            weight="bold"
            size="xs"
            color={achieved || active ? 'primary' : 'textTerciary'}
            letterSpacing="normal"
          >
            {milestone.minReviews}
          </ThemedText>
        </View>
        <ThemedText
          variant="mono"
          size="xs"
          color={achieved || active ? 'textPrimary' : 'textTerciary'}
          letterSpacing="normal"
          numberOfLines={1}
        >
          {milestone.label}
        </ThemedText>
      </Box>
    )
  }

  const progressText = progressState.next
    ? `faltam ${progressState.remaining} pra "${progressState.next.label}"`
    : 'badge máxima desbloqueada'
  const reviewText = isLoading ? 'carregando progresso...' : `review #${reviewCount}`

  return (
    <Screen>
      <Box flex={1} bg="background" pl={5} pr={5} pt={5} pb={5}>
        <Box flexDirection="row" justifyContent="flex-end">
          <Pressable accessibilityRole="button" accessibilityLabel="fechar" onPress={closeToFeed} style={styles.closeButton}>
            <ThemedIcon name="X" size={20} color="textPrimary" />
          </Pressable>
        </Box>

        <Box flex={1} justifyContent="space-between">
          <Box gap={6}>
            <Box gap={3}>
              <ThemedText variant="mono" color="textSecondary" letterSpacing="wider" textTransform="uppercase">
                review publicada
              </ThemedText>
              <ThemedText variant="title" letterSpacing="normal" style={styles.title}>
                obrigada por compartilhar
              </ThemedText>
              <ThemedText variant="mono" color="textSecondary" size="sm" letterSpacing="normal">
                {reviewText} · {placeName}
              </ThemedText>
            </Box>

            <Box alignItems="center" style={styles.reviewCountBlock}>
              <View style={styles.reviewCountCircle}>
                <ThemedText variant="mono" color="primary" letterSpacing="normal" style={styles.reviewCountNumber}>
                  {isLoading ? '--' : reviewCount}
                </ThemedText>
              </View>
            </Box>

            <Box gap={4} style={styles.progressBlock}>
              <Box flexDirection="row" justifyContent="space-between" alignItems="center">
                <ThemedText variant="mono" color="textSecondary" size="xs" letterSpacing="normal">
                  progresso
                </ThemedText>
                <ThemedText variant="mono" weight="bold" color="textPrimary" letterSpacing="normal">
                  {isLoading ? '--' : `${reviewCount} / ${progressState.next?.minReviews ?? 20}`}
                </ThemedText>
              </Box>

              <View style={styles.progressTrack}>
                <Animated.View style={[styles.progressFill, animatedProgressStyle]} />
              </View>

              {isLoading ? (
                <Box flexDirection="row" alignItems="center" gap={2}>
                  <ActivityIndicator color={theme.colors.primary} size="small" />
                  <ThemedText variant="mono" color="textSecondary" size="xs" letterSpacing="normal">
                    buscando seus marcos nesse local
                  </ThemedText>
                </Box>
              ) : isError ? (
                <ThemedText variant="mono" color="textSecondary" size="xs" letterSpacing="normal">
                  não foi possível carregar seu progresso agora
                </ThemedText>
              ) : (
                <ThemedText variant="mono" color="textSecondary" size="xs" letterSpacing="normal">
                  {progressText}
                </ThemedText>
              )}
            </Box>

            <Box style={styles.milestonesCard} gap={4}>
              <ThemedText variant="mono" color="textSecondary" size="xs" letterSpacing="wider" textTransform="uppercase">
                marcos
              </ThemedText>
              <Box flexDirection="row" justifyContent="space-between">
                {BADGE_MILESTONES.map(renderMilestone)}
              </Box>
            </Box>
          </Box>

          <Button onPress={closeToFeed}>
            <ThemedText weight="bold" color="background" letterSpacing="normal">
              ver feed
            </ThemedText>
          </Button>
        </Box>
      </Box>
    </Screen>
  )
}

const styles = StyleSheet.create({
  closeButton: {
    width: space(10),
    height: space(10),
    borderRadius: space(5),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.backgroundSecondary
  },
  title: {
    maxWidth: 320
  },
  reviewCountBlock: {
    marginTop: space(8)
  },
  reviewCountCircle: {
    width: space(16) * 3,
    height: space(16) * 3,
    borderRadius: space(16) * 1.5,
    borderWidth: 2,
    borderColor: theme.colors.info,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primaryGlow
  },
  reviewCountNumber: {
    fontSize: 64,
    lineHeight: 72
  },
  progressBlock: {
    marginTop: space(6)
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: theme.colors.backgroundSecondary
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: theme.colors.primary
  },
  milestonesCard: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: space(5),
    backgroundColor: theme.colors.backgroundSecondary
  },
  milestone: {
    flex: 1
  },
  milestoneCircle: {
    width: space(12),
    height: space(12),
    borderRadius: space(6),
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center'
  },
  milestoneCircleAchieved: {
    borderColor: theme.colors.primary
  },
  milestoneCircleActive: {
    borderWidth: 2,
    borderColor: theme.colors.textPrimary
  }
})

import React from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, { AnimatedStyle } from 'react-native-reanimated'

import { Box, ThemedText } from '@src/shared/components'
import { theme } from '@src/shared/constants/theme'
import { useAppTranslation } from '@src/shared/i18n'
import { space } from '@src/shared/utils'

import { BADGE_MILESTONES, BadgeMilestone } from '../constants'

type ProgressState = {
  current: BadgeMilestone | null
  next: BadgeMilestone | null
}

type Props = {
  reviewCount: number
  progressState: ProgressState
  style: AnimatedStyle
}

export const MilestonesFloatingCard: React.FC<Props> = ({ reviewCount, progressState, style }) => {
  const { t } = useAppTranslation()

  return (
    <Animated.View pointerEvents="none" style={[styles.floating, style]}>
      <Box style={styles.card} gap={4}>
        <ThemedText variant="mono" color="textSecondary" size="xs" letterSpacing="wider" textTransform="uppercase">
          {t('post.success.milestones')}
        </ThemedText>
        <Box flexDirection="row" justifyContent="space-between">
          {BADGE_MILESTONES.map((milestone) => (
            <Milestone
              key={milestone.tier}
              milestone={milestone}
              reviewCount={reviewCount}
              progressState={progressState}
            />
          ))}
        </Box>
      </Box>
    </Animated.View>
  )
}

type MilestoneProps = {
  milestone: BadgeMilestone
  reviewCount: number
  progressState: ProgressState
}

const Milestone: React.FC<MilestoneProps> = ({ milestone, reviewCount, progressState }) => {
  const { t } = useAppTranslation()
  const achieved = reviewCount >= milestone.minReviews
  const active =
    progressState.current?.tier === milestone.tier ||
    (!progressState.current && progressState.next?.tier === milestone.tier)

  return (
    <Box alignItems="center" gap={2} style={styles.milestone}>
      <View style={[styles.circle, achieved && styles.circleAchieved, active && styles.circleActive]}>
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
        {t(milestone.labelKey)}
      </ThemedText>
    </Box>
  )
}

const styles = StyleSheet.create({
  floating: {
    position: 'absolute',
    left: space(5),
    right: space(5),
    bottom: space(16) + space(12),
    zIndex: 2
  },
  card: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: space(5),
    backgroundColor: theme.colors.backgroundSecondary
  },
  milestone: {
    flex: 1
  },
  circle: {
    width: space(12),
    height: space(12),
    borderRadius: space(6),
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center'
  },
  circleAchieved: {
    borderColor: theme.colors.primary
  },
  circleActive: {
    borderWidth: 2,
    borderColor: theme.colors.textPrimary
  }
})

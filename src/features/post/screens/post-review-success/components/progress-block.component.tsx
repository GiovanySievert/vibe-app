import React from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import Animated, { AnimatedStyle } from 'react-native-reanimated'

import { Box, ThemedText } from '@src/shared/components'
import { theme } from '@src/shared/constants/theme'
import { useAppTranslation } from '@src/shared/i18n'

type Props = {
  reviewCount: number
  progressTarget: number
  progressText: string
  hasUnlockedBadge: boolean
  isLoading: boolean
  isError: boolean
  progressStyle: AnimatedStyle
}

export const ProgressBlock: React.FC<Props> = ({
  reviewCount,
  progressTarget,
  progressText,
  hasUnlockedBadge,
  isLoading,
  isError,
  progressStyle
}) => (
  <ProgressBlockContent
    reviewCount={reviewCount}
    progressTarget={progressTarget}
    progressText={progressText}
    hasUnlockedBadge={hasUnlockedBadge}
    isLoading={isLoading}
    isError={isError}
    progressStyle={progressStyle}
  />
)

const ProgressBlockContent: React.FC<Props> = ({
  reviewCount,
  progressTarget,
  progressText,
  hasUnlockedBadge,
  isLoading,
  isError,
  progressStyle
}) => {
  const { t } = useAppTranslation()

  return (
    <Box gap={4} mt={6}>
      <Box flexDirection="row" justifyContent="space-between" alignItems="center">
        <ThemedText variant="mono" color="textSecondary" size="xs" letterSpacing="normal">
          {hasUnlockedBadge ? t('post.success.nextLevel') : t('post.success.progressLabel')}
        </ThemedText>
        <ThemedText variant="mono" weight="bold" color="textPrimary" letterSpacing="normal">
          {isLoading ? '--' : `${reviewCount} / ${progressTarget}`}
        </ThemedText>
      </Box>

      <View style={styles.track}>
        <Animated.View style={[styles.fill, progressStyle]} />
      </View>

      {isLoading ? (
        <Box flexDirection="row" alignItems="center" gap={2}>
          <ActivityIndicator color={theme.colors.primary} size="small" />
          <ThemedText variant="mono" color="textSecondary" size="xs" letterSpacing="normal">
            {t('post.success.loadingMilestones')}
          </ThemedText>
        </Box>
      ) : isError ? (
        <ThemedText variant="mono" color="textSecondary" size="xs" letterSpacing="normal">
          {t('post.success.progressFailed')}
        </ThemedText>
      ) : (
        <ThemedText variant="mono" color="textSecondary" size="xs" letterSpacing="normal">
          {progressText}
        </ThemedText>
      )}
    </Box>
  )
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: theme.colors.backgroundSecondary
  },
  fill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: theme.colors.primary
  }
})

import React from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import Animated, { AnimatedStyle } from 'react-native-reanimated'

import { Box, ThemedText } from '@src/shared/components'
import { theme } from '@src/shared/constants/theme'

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
  <Box gap={4} mt={6}>
    <Box flexDirection="row" justifyContent="space-between" alignItems="center">
      <ThemedText variant="mono" color="textSecondary" size="xs" letterSpacing="normal">
        {hasUnlockedBadge ? 'próximo nível' : 'progresso'}
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
)

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

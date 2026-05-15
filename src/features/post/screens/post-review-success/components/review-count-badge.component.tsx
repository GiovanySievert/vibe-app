import React from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, { AnimatedProps } from 'react-native-reanimated'
import Svg, { Circle, CircleProps } from 'react-native-svg'

import { Box, ThemedText } from '@src/shared/components'
import { theme } from '@src/shared/constants/theme'

import {
  REVIEW_COUNT_CIRCLE_SIZE,
  REVIEW_COUNT_RING_CIRCUMFERENCE,
  REVIEW_COUNT_RING_RADIUS,
  REVIEW_COUNT_RING_STROKE_WIDTH,
  REVIEW_COUNT_UNLOCKED_BG
} from '../constants'

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

type Props = {
  reviewCount: number
  hasUnlockedBadge: boolean
  isLoading: boolean
  ringProps: Partial<AnimatedProps<CircleProps>>
}

export const ReviewCountBadge: React.FC<Props> = ({ reviewCount, hasUnlockedBadge, isLoading, ringProps }) => (
  <Box alignItems="center" mt={8}>
    <View style={[styles.circle, hasUnlockedBadge && styles.circleUnlocked]}>
      {hasUnlockedBadge ? (
        <Svg width={REVIEW_COUNT_CIRCLE_SIZE} height={REVIEW_COUNT_CIRCLE_SIZE} style={styles.ring}>
          <Circle
            cx={REVIEW_COUNT_CIRCLE_SIZE / 2}
            cy={REVIEW_COUNT_CIRCLE_SIZE / 2}
            r={REVIEW_COUNT_RING_RADIUS}
            stroke={theme.colors.border}
            strokeWidth={REVIEW_COUNT_RING_STROKE_WIDTH}
            fill="none"
          />
          <AnimatedCircle
            cx={REVIEW_COUNT_CIRCLE_SIZE / 2}
            cy={REVIEW_COUNT_CIRCLE_SIZE / 2}
            r={REVIEW_COUNT_RING_RADIUS}
            stroke={theme.colors.primary}
            strokeWidth={REVIEW_COUNT_RING_STROKE_WIDTH}
            strokeLinecap="round"
            strokeDasharray={`${REVIEW_COUNT_RING_CIRCUMFERENCE} ${REVIEW_COUNT_RING_CIRCUMFERENCE}`}
            animatedProps={ringProps}
            fill="none"
          />
        </Svg>
      ) : null}
      <ThemedText variant="mono" color="primary" letterSpacing="normal" style={styles.number}>
        {isLoading ? '--' : reviewCount}
      </ThemedText>
    </View>
  </Box>
)

const styles = StyleSheet.create({
  circle: {
    width: REVIEW_COUNT_CIRCLE_SIZE,
    height: REVIEW_COUNT_CIRCLE_SIZE,
    borderRadius: REVIEW_COUNT_CIRCLE_SIZE / 2,
    borderWidth: 2,
    borderColor: theme.colors.info,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primaryGlow
  },
  circleUnlocked: {
    borderColor: 'transparent',
    backgroundColor: REVIEW_COUNT_UNLOCKED_BG
  },
  ring: {
    position: 'absolute',
    transform: [{ rotate: '180deg' }]
  },
  number: {
    fontSize: 64,
    lineHeight: 72
  }
})

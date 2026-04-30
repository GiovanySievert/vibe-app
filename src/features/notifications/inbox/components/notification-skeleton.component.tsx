import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated'

import { Box, Divider } from '@src/shared/components'
import { theme } from '@src/shared/constants/theme'

const SkeletonRow = () => (
  <Box flexDirection="row" gap={3} pt={3} pb={3} alignItems="flex-start">
    <View style={styles.iconBlock} />
    <Box flex={1} gap={2}>
      <View style={[styles.line, { width: '60%' }]} />
      <View style={[styles.line, { width: '90%' }]} />
      <View style={[styles.line, { width: '30%', height: 10 }]} />
    </Box>
  </Box>
)

export const NotificationSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => {
  const opacity = useSharedValue(0.5)

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 700 }), -1, true)
    return () => cancelAnimation(opacity)
  }, [opacity])

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))

  return (
    <Animated.View style={animatedStyle}>
      <Box pl={5} pr={5}>
        {Array.from({ length: rows }).map((_, idx) => (
          <React.Fragment key={idx}>
            <SkeletonRow />
            {idx !== rows - 1 && <Divider />}
          </React.Fragment>
        ))}
      </Box>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  iconBlock: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.backgroundSecondary
  },
  line: {
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.backgroundSecondary
  }
})

import React, { useEffect } from 'react'
import { StyleSheet } from 'react-native'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated'

import { Box } from '@src/shared/components'

export const UsersProfileFollowListLoading: React.FC = () => {
  const opacity = useSharedValue(1)

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.6, { duration: 900, easing: Easing.inOut(Easing.ease) }), -1, true)
  }, [opacity])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value
    }
  })

  return (
    <Box style={styles.loadingSkeletonBox} pr={5} pl={5} mt={4} gap={5}>
      <Box>
        <Box flexDirection="row" gap={4} alignItems="center">
          <Animated.View style={[styles.loadingAvatar, animatedStyle]} />
          <Animated.View style={[styles.loadingSkeletonPrimary, { width: '80%' }, animatedStyle]} />
        </Box>
      </Box>

      <Box>
        <Box flexDirection="row" gap={4} alignItems="center">
          <Animated.View style={[styles.loadingAvatar, animatedStyle]} />
          <Animated.View style={[styles.loadingSkeletonPrimary, { width: '80%' }, animatedStyle]} />
        </Box>
      </Box>

      <Box>
        <Box flexDirection="row" gap={4} alignItems="center">
          <Animated.View style={[styles.loadingAvatar, animatedStyle]} />
          <Animated.View style={[styles.loadingSkeletonPrimary, { width: '80%' }, animatedStyle]} />
        </Box>
      </Box>

      <Box>
        <Box flexDirection="row" gap={4} alignItems="center">
          <Animated.View style={[styles.loadingAvatar, animatedStyle]} />
          <Animated.View style={[styles.loadingSkeletonPrimary, { width: '80%' }, animatedStyle]} />
        </Box>
      </Box>

      <Box alignItems="center" justifyContent="center" mt={3}>
        <Animated.View style={[styles.loadingButton, { width: '100%' }, animatedStyle]} />
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  loadingSkeletonBox: {
    flex: 1
  },

  loadingAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#E5E7EB'
  },
  loadingSkeletonPrimary: {
    height: 24,
    borderRadius: 4,
    marginRight: 12,
    backgroundColor: '#E5E7EB',
    width: '80%'
  },
  loadingButton: {
    height: 44,
    borderRadius: 10,
    marginRight: 20,
    marginLeft: 20,
    backgroundColor: '#E5E7EB'
  }
})

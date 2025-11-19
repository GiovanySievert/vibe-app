import React, { useEffect } from 'react'
import { StyleSheet } from 'react-native'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated'

import { Box } from '../box'

interface LoadingPageProps {
  //
}

export const LoadingPage: React.FC<LoadingPageProps> = () => {
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
    <Box mt={4} style={styles.loadingSkeletonBox}>
      <Box>
        <Box mt={4}>
          <Box flexDirection="row" gap={2} alignItems="center">
            <Animated.View style={[styles.loadingRectangle, animatedStyle]} />
            <Animated.View style={[styles.loadingSkeletonPrimary, { width: '90%' }, animatedStyle]} />
          </Box>
          <Box flexDirection="row" gap={2} alignItems="center" mt={4}>
            <Animated.View style={[styles.loadingRectangle, animatedStyle]} />
            <Animated.View style={[styles.loadingSkeletonPrimary, { width: '90%' }, animatedStyle]} />
          </Box>

          <Box flexDirection="row" gap={2} alignItems="center" mt={4}>
            <Animated.View style={[styles.loadingRectangle, animatedStyle]} />
            <Animated.View style={[styles.loadingSkeletonPrimary, { width: '90%' }, animatedStyle]} />
          </Box>

          <Box flexDirection="row" gap={2} alignItems="center" mt={4}>
            <Animated.View style={[styles.loadingRectangle, animatedStyle]} />
            <Animated.View style={[styles.loadingSkeletonPrimary, { width: '90%' }, animatedStyle]} />
          </Box>

          <Box flexDirection="row" gap={2} alignItems="center" mt={4}>
            <Animated.View style={[styles.loadingRectangle, animatedStyle]} />
            <Animated.View style={[styles.loadingSkeletonPrimary, { width: '90%' }, animatedStyle]} />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  pill: {
    width: 100,
    height: 24,
    borderRadius: 4,
    backgroundColor: '#e2e8f0'
  },
  loadingSkeletonBox: {
    width: '100%'
  },
  loadingSkeletonWidthNameHeader: {
    width: 120,
    height: 72,
    backgroundColor: '#e2e8f0',
    borderRadius: 4
  },
  loadingSkeletonBanner: {
    height: 48,
    backgroundColor: '#E5E7EB',
    borderRadius: 12
  },
  loadingRectangle: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: '#E5E7EB'
  },
  loadingSkeletonPrimary: {
    height: 24,
    borderRadius: 4,
    marginRight: 12,
    backgroundColor: '#E5E7EB',
    width: '100%'
  },
  loadingHeaderView: {
    height: 44,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333'
  }
})

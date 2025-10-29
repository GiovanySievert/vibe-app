import React, { useEffect } from 'react'
import { StyleSheet } from 'react-native'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated'

import { Box } from '../box'

interface LoadingApplicationProps {
  isVisible: boolean
}

export const LoadingApplication: React.FC<LoadingApplicationProps> = ({ isVisible }) => {
  const opacity = useSharedValue(1)

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.6, { duration: 900, easing: Easing.inOut(Easing.ease) }), -1, true)
  }, [opacity])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value
    }
  })

  if (!isVisible) return null

  return (
    <Animated.View style={styles.loadingOverlay}>
      <Box mt={10} mr={6} ml={6} style={styles.loadingSkeletonBox}>
        <Box mr={6} ml={6} style={styles.loadingHeaderView}>
          <Animated.View
            style={[styles.loadingSkeletonWidthNameHeader, animatedStyle]}
            testID="loading-skeleton-width-name-header"
          />
        </Box>
        <Box pr={5} pl={4}>
          <Box mt={4}>
            <Box flexDirection="row" gap={2} alignItems="center" ml={3} mt={7}>
              <Animated.View style={[styles.loadingRectangle, animatedStyle]} />
              <Animated.View style={[styles.loadingSkeletonPrimary, { width: '90%' }, animatedStyle]} />
            </Box>
            <Box flexDirection="row" gap={2} alignItems="center" ml={3} mt={10}>
              <Animated.View style={[styles.loadingRectangle, animatedStyle]} />
              <Animated.View style={[styles.loadingSkeletonPrimary, { width: '90%' }, animatedStyle]} />
            </Box>
            <Box flexDirection="row" gap={2} alignItems="center" ml={3} mt={20}>
              <Animated.View style={[styles.loadingRectangle, animatedStyle]} />
              <Animated.View style={[styles.loadingSkeletonPrimary, { width: '90%' }, animatedStyle]} />
            </Box>
            <Box mt={8} ml={3}>
              <Animated.View style={[styles.loadingSkeletonBanner, animatedStyle]} />
            </Box>
            <Box mt={8}>
              <Animated.View style={[styles.loadingSkeletonPrimary, { width: '100%' }, animatedStyle]} />
            </Box>

            <Box flexDirection="row" gap={6} ml={2}>
              <Box mt={8} flexDirection="row" gap={2}>
                <Animated.View style={[styles.loadingRectangle, animatedStyle]} />
                <Animated.View style={[styles.pill, animatedStyle]} />
              </Box>
              <Box mt={8} flexDirection="row" gap={2}>
                <Animated.View style={[styles.loadingRectangle, animatedStyle]} />
                <Animated.View style={[styles.pill, animatedStyle]} />
              </Box>
              <Box mt={8} flexDirection="row" gap={2}>
                <Animated.View style={[styles.loadingRectangle, animatedStyle]} />
                <Animated.View style={[styles.pill, animatedStyle]} />
              </Box>
            </Box>

            <Box mt={9} gap={8}>
              <Animated.View style={[styles.loadingSkeletonPrimary, animatedStyle]} />
              <Animated.View style={[styles.loadingSkeletonPrimary, animatedStyle]} />
              <Animated.View style={[styles.loadingSkeletonPrimary, animatedStyle]} />
              <Animated.View style={[styles.loadingSkeletonPrimary, animatedStyle]} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
    zIndex: 999
  },
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
    backgroundColor: '#e2e8f0'
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

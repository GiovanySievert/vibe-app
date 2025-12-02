import React, { useEffect } from 'react'
import { StyleSheet } from 'react-native'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated'

import { Box, Divider, ThemedText } from '@src/shared/components'

export const UsersProfileHeaderLoading: React.FC = () => {
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
    <Box style={styles.loadingSkeletonBox}>
      <Box pr={8} pl={5} mt={4} gap={3}>
        <Box flexDirection="row" gap={4} alignItems="center" mb={3}>
          <Animated.View style={[styles.loadingAvatar, animatedStyle]} />
          <Animated.View style={[styles.loadingSkeletonPrimary, { width: '25%' }, animatedStyle]} />

          <Box flexDirection="row" gap={3} mt={6}>
            <Box alignItems="center">
              <Animated.View style={[styles.loadingSkeletonPrimary, { width: '30%', left: 5 }, animatedStyle]} />
              <ThemedText variant="secondary" size="sm">
                Seguindo
              </ThemedText>
            </Box>

            <Box alignItems="center">
              <Animated.View style={[styles.loadingSkeletonPrimary, { width: '25%', left: 6 }, animatedStyle]} />
              <ThemedText variant="secondary" size="sm">
                Seguidores
              </ThemedText>
            </Box>
          </Box>
        </Box>
      </Box>
      <Divider />
      <Animated.View style={[styles.loadingButton, animatedStyle]} />
    </Box>
  )
}

const styles = StyleSheet.create({
  loadingSkeletonBox: {
    flex: 1
  },

  loadingAvatar: {
    width: 80,
    height: 80,
    borderRadius: '100%',
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
    backgroundColor: '#E5E7EB',
    marginTop: 8
  },
  loadingNumbers: {
    height: 8
  }
})

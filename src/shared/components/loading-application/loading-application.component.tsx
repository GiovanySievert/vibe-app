import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

import { theme } from '@src/shared/constants/theme'

import { ThemedText } from '../themed-text'

interface LoadingApplicationProps {
  isVisible: boolean
}

const EXIT_DURATION_MS = 400

export const LoadingApplication: React.FC<LoadingApplicationProps> = ({ isVisible }) => {
  const [shouldRender, setShouldRender] = useState(isVisible)
  const opacity = useSharedValue(1)
  const scale = useSharedValue(1)

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true)
      opacity.value = 1
      scale.value = 1
      return
    }

    opacity.value = withTiming(0, { duration: EXIT_DURATION_MS, easing: Easing.out(Easing.cubic) }, (finished) => {
      if (finished) runOnJS(setShouldRender)(false)
    })
    scale.value = withTiming(1.08, { duration: EXIT_DURATION_MS, easing: Easing.out(Easing.cubic) })
  }, [isVisible, opacity, scale])

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value
  }))

  const textStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }))

  if (!shouldRender) return null

  return (
    <Animated.View pointerEvents={isVisible ? 'auto' : 'none'} style={[styles.container, containerStyle]}>
      <Animated.View style={textStyle}>
        <ThemedText color="primary" variant="title" style={styles.text}>
          vibes
        </ThemedText>
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    zIndex: 999
  },
  text: {
    fontSize: 52,
    fontWeight: '700',
    color: theme.colors.primary,
    lineHeight: 52
  }
})

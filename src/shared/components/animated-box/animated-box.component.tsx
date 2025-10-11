import React from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

type Props = {
  isVisible: boolean
  children: React.ReactNode
  duration?: number
}

export const AnimatedBox: React.FC<Props> = ({ isVisible, children, duration = 300 }) => {
  const measured = React.useRef(false)
  const contentHeight = useSharedValue(0)
  const progress = useSharedValue(isVisible ? 1 : 0)

  React.useEffect(() => {
    progress.value = withTiming(isVisible ? 1 : 0, {
      duration,
      easing: Easing.inOut(Easing.quad)
    })
  }, [isVisible, progress, duration])

  const animatedStyle = useAnimatedStyle(() => ({
    height: contentHeight.value * progress.value,
    opacity: progress.value,
    overflow: 'hidden'
  }))

  const onMeasure = React.useCallback(
    (e: any) => {
      if (measured.current) return
      const h = e.nativeEvent.layout.height
      if (h > 0) {
        contentHeight.value = h
        measured.current = true
      }
    },
    [contentHeight]
  )

  return (
    <>
      <View style={style.container} onLayout={onMeasure}>
        {children}
      </View>

      <Animated.View style={animatedStyle} pointerEvents={isVisible ? 'auto' : 'none'}>
        <View>{children}</View>
      </Animated.View>
    </>
  )
}

const style = StyleSheet.create({
  container: {
    position: 'absolute',
    opacity: 0,
    pointerEvents: 'none',
    left: 0,
    right: 0
  }
})

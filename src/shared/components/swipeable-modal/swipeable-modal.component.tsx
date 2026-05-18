import React, { useEffect } from 'react'
import { Dimensions, Modal, StyleSheet, View } from 'react-native'
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated, { clamp, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

import { theme } from '@src/shared/constants/theme'

import { AnimatedTouchable } from '../touchable'

const screenHeight = Dimensions.get('window').height

type SwipeableModalProps = {
  visible: boolean
  height?: number
  children: React.ReactNode
  isDismissible?: boolean
  testID?: string
  handleBarColor?: string
  onClose: () => void
}


export const SwipeableModal: React.FC<SwipeableModalProps> = ({
  visible,
  height = 500,
  children,
  isDismissible: isDismissible = true,
  handleBarColor = '#9CA3AF',
  onClose
}) => {
  const translateY = useSharedValue(screenHeight)
  const overlayOpacity = useSharedValue(0)

  useEffect(() => {
    translateY.value = withTiming(visible ? 0 : screenHeight, {
      duration: 500
    })

    if (visible) {
      overlayOpacity.value = withTiming(1, {
        duration: 500
      })
    }
  }, [visible, translateY, overlayOpacity])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }]
  }))

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value
  }))

  const closeModal = () => {
    overlayOpacity.value = withTiming(0, { duration: 300 })
    translateY.value = withTiming(screenHeight, { duration: 300 }, () => {
      runOnJS(onClose)()
    })
  }

  const pan = Gesture.Pan()
    .onStart(() => {
      translateY.value = withTiming(screenHeight, { duration: 500 })
    })
    .onUpdate(({ translationY }) => {
      translateY.value = clamp(translationY, 0, screenHeight)
      overlayOpacity.value = 1 - translationY / screenHeight
    })
    .onEnd(({ translationY }) => {
      if (translationY > 150) {
        translateY.value = withTiming(screenHeight, { duration: 300 }, () => {
          runOnJS(onClose)()
        })
        return
      }
      translateY.value = withTiming(0, { duration: 200 })
    })

  const modalStyle = [
    styles.modal,
    animatedStyle,
    {
      height: height
    }
  ]

  return (
    <Modal transparent visible={visible} animationType="none" testID="modal--swipeable-modal">
      <GestureHandlerRootView style={styles.gestureRoot}>
        <AnimatedTouchable
          activeOpacity={1}
          onPress={() => isDismissible && closeModal()}
          style={[styles.overlay, overlayStyle]}
          accessibilityRole="button"
          accessibilityLabel="Fechar modal"
          importantForAccessibility={isDismissible ? 'yes' : 'no-hide-descendants'}
        />

        <GestureDetector gesture={pan}>
          <Animated.View
            style={modalStyle}
            accessibilityViewIsModal
            importantForAccessibility="yes"
          >
            <View style={[styles.handleBar, { backgroundColor: handleBarColor }]} />
            {children}
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  gestureRoot: {
    flex: 1
  },
  modal: {
    width: '100%',
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0
  },
  overlay: {
    flex: 1,
    backgroundColor: '#4755698f',
    justifyContent: 'flex-end',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  handleBar: {
    marginTop: 12,
    marginBottom: 16,
    height: 3,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '10%',
    alignSelf: 'center'
  }
})

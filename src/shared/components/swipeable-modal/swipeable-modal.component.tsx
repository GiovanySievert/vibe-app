import React, { useEffect } from 'react'
import { Modal, Platform, StyleSheet, useWindowDimensions, View } from 'react-native'
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated, {
  clamp,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { PortalHost } from '@gorhom/portal'

import { PlatformOS } from '@src/shared/constants/platform'
import { theme } from '@src/shared/constants/theme'
import { useAppTranslation } from '@src/shared/i18n'
import { triggerLightHaptic } from '@src/shared/utils'

import { AnimatedTouchable } from '../touchable'

const DEFAULT_HEIGHT = 500
const DISMISS_DISTANCE = 120
const DISMISS_VELOCITY = 900
const SPRING_CONFIG = {
  damping: 24,
  mass: 0.9,
  stiffness: 260
}

type SwipeableModalProps = {
  visible: boolean
  height?: number
  maxHeight?: number
  snapPoint?: number | string
  children: React.ReactNode
  isDismissible?: boolean
  disableSwipeToClose?: boolean
  testID?: string
  handleBarColor?: string
  onClose: () => void
}

const resolveSnapPoint = (snapPoint: number | string | undefined, windowHeight: number) => {
  if (typeof snapPoint === 'number') return snapPoint

  if (typeof snapPoint !== 'string') return undefined

  const value = Number.parseFloat(snapPoint)

  if (Number.isNaN(value)) return undefined

  if (snapPoint.trim().endsWith('%')) return windowHeight * (value / 100)

  return value
}

export const SwipeableModal: React.FC<SwipeableModalProps> = ({
  visible,
  height = DEFAULT_HEIGHT,
  maxHeight,
  snapPoint,
  children,
  isDismissible = true,
  disableSwipeToClose = false,
  testID = 'modal--swipeable-modal',
  handleBarColor = '#9CA3AF',
  onClose
}) => {
  const { t } = useAppTranslation()
  const { height: windowHeight } = useWindowDimensions()
  const insets = useSafeAreaInsets()
  const requestedHeight = resolveSnapPoint(snapPoint, windowHeight) ?? height
  const maxAvailableHeight = Math.max(windowHeight - insets.top - 12, 0)
  const sheetHeight = Math.min(requestedHeight, maxHeight ?? maxAvailableHeight, maxAvailableHeight)
  const sheetContainerHeight = sheetHeight + insets.bottom
  const closedPosition = sheetContainerHeight + 32
  const canSwipeToClose = isDismissible && !disableSwipeToClose
  const translateY = useSharedValue(closedPosition)
  const dragStartY = useSharedValue(0)
  const progress = useSharedValue(0)
  const isClosing = useSharedValue(false)

  const handleClosed = (withHaptic: boolean) => {
    if (withHaptic) triggerLightHaptic()

    onClose()
  }

  useEffect(() => {
    if (visible) {
      isClosing.value = false
      progress.value = withTiming(1, { duration: 180 })
      translateY.value = withSpring(0, SPRING_CONFIG)
      return
    }

    progress.value = withTiming(0, { duration: 180 })
    translateY.value = closedPosition
  }, [closedPosition, isClosing, progress, translateY, visible])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }]
  }))

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: progress.value * clamp(1 - translateY.value / closedPosition, 0, 1)
  }))

  const closeModal = (withHaptic = true) => {
    if (!isDismissible || isClosing.value) return

    isClosing.value = true
    progress.value = withTiming(0, { duration: 160 })
    translateY.value = withSpring(closedPosition, { ...SPRING_CONFIG, velocity: DISMISS_VELOCITY }, finished => {
      if (finished) runOnJS(handleClosed)(withHaptic)
    })
  }

  const pan = Gesture.Pan()
    .onStart(() => {
      dragStartY.value = translateY.value
    })
    .onUpdate(({ translationY }) => {
      translateY.value = clamp(dragStartY.value + translationY, 0, closedPosition)
    })
    .onEnd(({ translationY, velocityY }) => {
      const shouldDismiss = translationY > DISMISS_DISTANCE || velocityY > DISMISS_VELOCITY

      if (shouldDismiss) {
        isClosing.value = true
        progress.value = withTiming(0, { duration: 160 })
        translateY.value = withSpring(closedPosition, { ...SPRING_CONFIG, velocity: velocityY }, finished => {
          if (finished) runOnJS(handleClosed)(true)
        })
        return
      }

      translateY.value = withSpring(0, { ...SPRING_CONFIG, velocity: velocityY })
    })
    .enabled(canSwipeToClose)

  const modalStyle = [
    styles.modal,
    animatedStyle,
    {
      height: sheetContainerHeight,
      paddingBottom: insets.bottom
    }
  ]

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      testID={testID}
      statusBarTranslucent
      navigationBarTranslucent={Platform.OS === PlatformOS.ANDROID}
      onRequestClose={() => closeModal(false)}
    >
      <GestureHandlerRootView style={styles.gestureRoot}>
        <AnimatedTouchable
          activeOpacity={1}
          onPress={() => closeModal()}
          style={[styles.overlay, overlayStyle]}
          accessibilityRole="button"
          accessibilityLabel={t('common.closeModal')}
          importantForAccessibility={isDismissible ? 'yes' : 'no-hide-descendants'}
        />

        <GestureDetector gesture={pan}>
          <Animated.View style={modalStyle} accessibilityViewIsModal importantForAccessibility="yes">
            <View style={[styles.handleBar, { backgroundColor: handleBarColor }]} />
            {children}
          </Animated.View>
        </GestureDetector>

        {Platform.OS === PlatformOS.ANDROID && <PortalHost name="toast" />}
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

import React, { useState } from 'react'
import { Dimensions, Image, Modal, Pressable, StyleSheet } from 'react-native'
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

import { theme } from '@src/shared/constants/theme'
import { useAppTranslation } from '@src/shared/i18n'

type EventCoverImageProps = {
  uri: string
  height?: number
}

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

export const EventCoverImage: React.FC<EventCoverImageProps> = ({ uri, height = 220 }) => {
  const { t } = useAppTranslation()
  const [visible, setVisible] = useState(false)
  const scale = useSharedValue(0.92)
  const opacity = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value
  }))

  const openModal = () => {
    setVisible(true)
    scale.value = withTiming(1, { duration: 200 })
    opacity.value = withTiming(1, { duration: 200 })
  }

  const closeModal = () => {
    scale.value = withTiming(0.92, { duration: 180 })
    opacity.value = withTiming(0, { duration: 180 }, (finished) => {
      if (finished) runOnJS(setVisible)(false)
    })
  }

  return (
    <>
      <Pressable
        onPress={openModal}
        accessibilityRole="imagebutton"
        accessibilityLabel={t('social.createEvent.photoSelectedA11y')}
        accessibilityHint={t('common.tapToExpand')}
      >
        <Image
          source={{ uri }}
          style={[styles.coverImage, { height }]}
          resizeMode="cover"
          accessible
          accessibilityLabel={t('social.createEvent.photoSelectedA11y')}
        />
      </Pressable>

      <Modal visible={visible} transparent animationType="none" statusBarTranslucent onRequestClose={closeModal}>
        <Pressable
          style={styles.backdrop}
          onPress={closeModal}
          accessibilityRole="button"
          accessibilityLabel={t('common.closeImage')}
        >
          <Animated.Image
            source={{ uri }}
            resizeMode="contain"
            style={[styles.fullImage, animatedStyle]}
            accessible
            accessibilityLabel={t('social.createEvent.photoSelectedA11y')}
          />
        </Pressable>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  coverImage: {
    width: '100%',
    borderRadius: 16
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16
  },
  fullImage: {
    width: screenWidth - 32,
    height: Math.min(screenHeight * 0.75, screenWidth * 1.25),
    borderRadius: 20,
    backgroundColor: theme.colors.backgroundSecondary
  }
})

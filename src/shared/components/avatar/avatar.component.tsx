import React, { useState } from 'react'
import { Dimensions, Image, type ImageSourcePropType, Modal, Pressable, StyleSheet, View } from 'react-native'
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

import { theme } from '@src/shared/constants/theme'

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const SIZES: Record<Size, number> = {
  xs: 32,
  sm: 44,
  md: 64,
  lg: 96,
  xl: 128
}

type AvatarProps = {
  size?: Size
  uri?: string | null
  source?: ImageSourcePropType
  square?: boolean
  pressable?: boolean
}

function createStyles(size: number, square = false) {
  const borderRadius = square ? 8 : size / 2

  return StyleSheet.create({
    root: {
      width: size,
      height: size
    },
    placeholder: {
      width: size,
      height: size,
      borderRadius,
      backgroundColor: theme.colors.textPrimary
    },
    image: {
      width: size,
      height: size,
      borderRadius
    }
  })
}

const screenWidth = Dimensions.get('window').width

const modalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  fullImage: {
    width: screenWidth,
    height: screenWidth,
    borderRadius: screenWidth / 2 - 20,
    padding: 20
  }
})

export const Avatar: React.FC<AvatarProps> = ({ size = 'md', uri, source, square = false, pressable = false }) => {
  const avatarSize = SIZES[size]
  const imgSource = uri ? { uri } : source
  const s = createStyles(avatarSize, square)

  const [visible, setVisible] = useState(false)
  const scale = useSharedValue(0.3)
  const opacity = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value
  }))

  function openModal() {
    setVisible(true)
    scale.value = withTiming(1, { duration: 200 })
    opacity.value = withTiming(1, { duration: 200 })
  }

  function closeModal() {
    scale.value = withTiming(0.3, { duration: 200 })
    opacity.value = withTiming(0, { duration: 200 }, (finished) => {
      if (finished) runOnJS(setVisible)(false)
    })
  }

  const imageEl = imgSource ? (
    <Image source={imgSource as ImageSourcePropType} resizeMode="cover" style={s.image} />
  ) : (
    <View style={s.placeholder} />
  )

  return (
    <>
      {pressable && imgSource ? (
        <Pressable onPress={openModal} style={s.root}>
          {imageEl}
        </Pressable>
      ) : (
        <View style={s.root}>{imageEl}</View>
      )}

      <Modal visible={visible} transparent animationType="none" statusBarTranslucent onRequestClose={closeModal}>
        <Pressable style={modalStyles.backdrop} onPress={closeModal}>
          <Animated.Image
            source={imgSource as ImageSourcePropType}
            resizeMode="cover"
            style={[modalStyles.fullImage, animatedStyle]}
          />
        </Pressable>
      </Modal>
    </>
  )
}

import React, { useState } from 'react'
import { Dimensions, Image, type ImageSourcePropType, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

import { icons } from 'lucide-react-native'

import { theme } from '@src/shared/constants/theme'

import { ThemedIcon } from '../themed-icon/themed-icon.component'

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type IconName = keyof typeof icons

const SIZES: Record<Size, number> = {
  xs: 32,
  sm: 52,
  md: 64,
  lg: 96,
  xl: 128
}

const ICON_SIZES: Record<Size, number> = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 36,
  xl: 48
}

const LETTER_SIZES: Record<Size, number> = {
  xs: 13,
  sm: 18,
  md: 22,
  lg: 34,
  xl: 46
}

type AvatarProps = {
  size?: Size
  uri?: string | null
  source?: ImageSourcePropType
  square?: boolean
  pressable?: boolean
  placeholderIcon?: IconName
  fallbackLetter?: string
  onPress?: () => void
  accessibilityLabel?: string
}

function createStyles(size: number, square = false, hasPlaceholder = false) {
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
      backgroundColor: hasPlaceholder ? theme.colors.backgroundSecondary : theme.colors.textPrimary,
      alignItems: 'center',
      justifyContent: 'center'
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

export const Avatar: React.FC<AvatarProps> = ({
  size = 'md',
  uri,
  source,
  square = false,
  pressable = false,
  placeholderIcon,
  fallbackLetter,
  onPress,
  accessibilityLabel
}) => {
  const resolvedLabel =
    accessibilityLabel ?? (fallbackLetter ? `Foto de perfil de ${fallbackLetter}` : 'Foto de perfil')
  const avatarSize = SIZES[size]
  const imgSource = uri ? { uri } : source
  const hasPlaceholder = !!(placeholderIcon || fallbackLetter)
  const s = createStyles(avatarSize, square, hasPlaceholder)

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

  const letter = fallbackLetter?.charAt(0).toUpperCase()

  const imageEl = imgSource ? (
    <Image
      source={imgSource as ImageSourcePropType}
      resizeMode="cover"
      style={s.image}
      accessible
      accessibilityLabel={resolvedLabel}
    />
  ) : (
    <View style={s.placeholder} accessible accessibilityLabel={resolvedLabel}>
      {letter ? (
        <Text style={{ color: theme.colors.textPrimary, fontSize: LETTER_SIZES[size], fontWeight: '600' }}>
          {letter}
        </Text>
      ) : placeholderIcon ? (
        <ThemedIcon name={placeholderIcon} size={ICON_SIZES[size]} color="textSecondary" />
      ) : null}
    </View>
  )

  const content = pressable && imgSource ? (
    <Pressable
      onPress={openModal}
      style={s.root}
      accessibilityRole="imagebutton"
      accessibilityLabel={resolvedLabel}
      accessibilityHint="Toque para ampliar"
    >
      {imageEl}
    </Pressable>
  ) : (
    <View style={s.root}>{imageEl}</View>
  )

  return (
    <>
      {onPress ? (
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={resolvedLabel}
        >
          {content}
        </TouchableOpacity>
      ) : (
        content
      )}

      <Modal visible={visible} transparent animationType="none" statusBarTranslucent onRequestClose={closeModal}>
        <Pressable
          style={modalStyles.backdrop}
          onPress={closeModal}
          accessibilityRole="button"
          accessibilityLabel="Fechar imagem"
        >
          <Animated.Image
            source={imgSource as ImageSourcePropType}
            resizeMode="cover"
            style={[modalStyles.fullImage, animatedStyle]}
            accessible
            accessibilityLabel={resolvedLabel}
          />
        </Pressable>
      </Modal>
    </>
  )
}

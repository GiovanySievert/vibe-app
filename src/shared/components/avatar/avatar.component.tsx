import React from 'react'
import { Image, type ImageSourcePropType, StyleSheet, View } from 'react-native'

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

export const Avatar: React.FC<AvatarProps> = ({ size = 'md', uri, source, square = false }) => {
  const avatarSize = SIZES[size]
  const imgSource = uri ? { uri } : source
  const s = createStyles(avatarSize, square)

  return (
    <View style={s.root}>
      {imgSource ? (
        <Image source={imgSource as ImageSourcePropType} resizeMode="cover" style={s.image} />
      ) : (
        <View style={s.placeholder} />
      )}
    </View>
  )
}

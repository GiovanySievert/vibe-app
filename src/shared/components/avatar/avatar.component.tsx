import React from 'react'
import { type ColorValue, Image, type ImageSourcePropType, StyleSheet, View } from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'

type Size = 'sm' | 'md' | 'lg' | 'xl'
const SIZES: Record<Size, number> = { sm: 44, md: 64, lg: 96, xl: 128 }

type GradientColors = Readonly<[ColorValue, ColorValue, ...ColorValue[]]>
const DEFAULT_COLORS: GradientColors = ['#7F5AF0', '#2CB67D'] as const

type AvatarProps = {
  size?: Size
  uri?: string
  source?: ImageSourcePropType
  ring?: number
  gap?: number
  colors?: GradientColors
  gapColor?: ColorValue
}

function createStyles(outer: number, img: number, gap: number, gapColor: ColorValue) {
  return StyleSheet.create({
    root: { width: outer, height: outer },
    ring: {
      width: outer,
      height: outer,
      borderRadius: outer / 2,
      alignItems: 'center',
      justifyContent: 'center'
    },
    gap: {
      width: img + 2 * gap,
      height: img + 2 * gap,
      borderRadius: (img + 2 * gap) / 2,
      backgroundColor: gapColor,
      alignItems: 'center',
      justifyContent: 'center'
    },
    image: { width: img, height: img, borderRadius: img / 2 }
  })
}

export const Avatar: React.FC<AvatarProps> = ({
  size = 'md',
  uri,
  source,
  ring = 4,
  gap = 4,
  colors = DEFAULT_COLORS,
  gapColor = '#000'
}) => {
  const img = SIZES[size]
  const outer = img + 2 * (gap + ring)
  const imgSource = uri ? { uri } : source
  const s = createStyles(outer, img, gap, gapColor)

  return (
    <View style={s.root}>
      <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.ring}>
        <View style={s.gap}>
          <Image source={imgSource as ImageSourcePropType} resizeMode="cover" style={s.image} />
        </View>
      </LinearGradient>
    </View>
  )
}

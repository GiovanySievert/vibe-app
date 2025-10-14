import React from 'react'
import { StyleSheet, Text, type TextProps, type TextStyle } from 'react-native'

import { AppTheme, theme } from '@src/shared/constants/theme'

export const TEXT_VARIANT = {
  primary: 'primary',
  secondary: 'secondary',
  title: 'title',
  subtitle: 'subtitle'
} as const

export type TextVariant = (typeof TEXT_VARIANT)[keyof typeof TEXT_VARIANT]

export type ThemedTextProps = TextProps & {
  variant?: TextVariant
  size?: keyof AppTheme['sizes']
  weight?: keyof AppTheme['weights']
  color?: keyof AppTheme['colors']
}

type TypographyValue = Partial<Pick<TextStyle, 'fontSize' | 'lineHeight' | 'letterSpacing'>>
type WeightValue = string | Partial<Pick<TextStyle, 'fontFamily' | 'fontWeight'>>
type SizeValue = number | TypographyValue
type WeightKey = keyof AppTheme['weights']

const FONT_BY_WEIGHT: Partial<Record<WeightKey, TextStyle['fontFamily']>> = {
  light: 'Poppins-Light',
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semibold: 'Poppins-SemiBold',
  bold: 'Poppins-Bold'
}

function sizeToStyle(v?: SizeValue): Partial<TextStyle> {
  if (typeof v === 'number') return { fontSize: v }
  return {
    ...(typeof v?.fontSize === 'number' ? { fontSize: v.fontSize } : null),
    ...(typeof v?.lineHeight === 'number' ? { lineHeight: v.lineHeight } : null),
    ...(typeof v?.letterSpacing === 'number' ? { letterSpacing: v.letterSpacing } : null)
  }
}

function weightToStyleFromTheme(v?: WeightValue, key?: WeightKey): Partial<TextStyle> {
  if (typeof v === 'string') {
    const hasFamilyNameShape = /[-\s]/.test(v)
    return hasFamilyNameShape
      ? { fontFamily: v }
      : key && FONT_BY_WEIGHT[key]
        ? { fontFamily: FONT_BY_WEIGHT[key]! }
        : {}
  }
  if (v?.fontFamily) return { fontFamily: v.fontFamily }
  if (v?.fontWeight) return { fontWeight: v.fontWeight }
  return key && FONT_BY_WEIGHT[key] ? { fontFamily: FONT_BY_WEIGHT[key]! } : {}
}

export function ThemedText({ style, variant = TEXT_VARIANT.primary, size, weight, color, ...rest }: ThemedTextProps) {
  const baseByVariant: Record<TextVariant, TextStyle> = {
    [TEXT_VARIANT.primary]: styles.primary,
    [TEXT_VARIANT.secondary]: styles.secondary,
    [TEXT_VARIANT.title]: styles.title,
    [TEXT_VARIANT.subtitle]: styles.subtitle
  }

  const overrideColor: Partial<TextStyle> = color ? { color: theme.colors[color] } : {}
  const overrideSize = size ? sizeToStyle(theme.sizes[size] as SizeValue) : {}
  const themeWeight = weight ? (theme.weights[weight] as WeightValue) : undefined
  const overrideWeight = weight ? weightToStyleFromTheme(themeWeight, weight) : {}

  return <Text style={[baseByVariant[variant], overrideColor, overrideSize, overrideWeight, style]} {...rest} />
}

const styles = StyleSheet.create({
  primary: { fontSize: 16, lineHeight: 24, fontFamily: 'Poppins-Regular', color: '#FAFAFA' },
  secondary: { fontSize: 16, lineHeight: 24, color: '#B5B5B5', fontFamily: 'Poppins-Regular' },
  title: { fontSize: 32, lineHeight: 34, color: '#FAFAFA', fontFamily: 'Poppins-Bold' },
  subtitle: { lineHeight: 32, fontSize: 24, color: '#FAFAFA', fontFamily: 'Poppins-Bold' }
} as const)

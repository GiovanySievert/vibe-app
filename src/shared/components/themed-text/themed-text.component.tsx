import React from 'react'
import { StyleSheet, Text, type TextProps, type TextStyle, View, type ViewStyle } from 'react-native'

import { AppTheme, theme } from '@src/shared/constants/theme'

export const TEXT_VARIANT = {
  primary: 'primary',
  secondary: 'secondary',
  title: 'title',
  subtitle: 'subtitle',
  mono: 'mono'
} as const

export type TextVariant = (typeof TEXT_VARIANT)[keyof typeof TEXT_VARIANT]

export type ThemedTextProps = TextProps & {
  variant?: TextVariant
  size?: keyof AppTheme['sizes']
  weight?: keyof AppTheme['weights']
  color?: keyof AppTheme['colors']
  letterSpacing?: keyof AppTheme['letterSpacings']
  textDecorationLine?: TextStyle['textDecorationLine']
  underlineOffset?: number
  textTransform?: TextStyle['textTransform']
}

type TypographyValue = Partial<Pick<TextStyle, 'fontSize' | 'lineHeight' | 'letterSpacing'>>
type WeightValue = string | Partial<Pick<TextStyle, 'fontFamily' | 'fontWeight'>>
type SizeValue = number | TypographyValue
type WeightKey = keyof AppTheme['weights']

const FONT_BY_WEIGHT: Partial<Record<WeightKey, TextStyle['fontFamily']>> = {
  light: 'InterTight-Regular',
  regular: 'InterTight-Regular',
  medium: 'InterTight-Medium',
  semibold: 'InterTight-SemiBold',
  bold: 'InterTight-Bold'
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

const UNDERLINE_VARIANTS: TextStyle['textDecorationLine'][] = ['underline', 'underline line-through']

export function ThemedText({
  style,
  variant = TEXT_VARIANT.primary,
  size,
  weight,
  color,
  letterSpacing,
  textDecorationLine,
  textTransform,
  underlineOffset = -5,
  ...rest
}: ThemedTextProps) {
  const baseByVariant: Record<TextVariant, TextStyle> = {
    [TEXT_VARIANT.primary]: styles.primary,
    [TEXT_VARIANT.secondary]: styles.secondary,
    [TEXT_VARIANT.title]: styles.title,
    [TEXT_VARIANT.subtitle]: styles.subtitle,
    [TEXT_VARIANT.mono]: styles.mono
  }

  const overrideColor: Partial<TextStyle> = color ? { color: theme.colors[color] } : {}
  const overrideSize = size ? sizeToStyle(theme.sizes[size] as SizeValue) : {}
  const themeWeight = weight ? (theme.weights[weight] as WeightValue) : undefined
  const overrideWeight = weight ? weightToStyleFromTheme(themeWeight, weight) : {}
  const overrideLetterSpacing: Partial<TextStyle> = letterSpacing !== undefined ? { letterSpacing: theme.letterSpacings[letterSpacing] } : {}
  const overrideTextTransform: Partial<TextStyle> = textTransform ? { textTransform: textTransform } : {}

  const useManualUnderline = textDecorationLine != null && UNDERLINE_VARIANTS.includes(textDecorationLine)

  if (useManualUnderline) {
    const resolvedStyle = StyleSheet.flatten([
      baseByVariant[variant],
      overrideColor,
      overrideSize,
      overrideWeight,
      overrideLetterSpacing,
      overrideTextTransform,
      style
    ]) as TextStyle
    const borderColor = resolvedStyle.color as string | undefined
    const hasLineThrough = textDecorationLine === 'underline line-through'

    const wrapperStyle: ViewStyle = {
      alignSelf: 'flex-start',
      paddingBottom: underlineOffset,
      borderBottomWidth: 1,
      borderBottomColor: borderColor
    }
    const lineThrough: TextStyle = hasLineThrough ? { textDecorationLine: 'line-through' } : {}

    return (
      <View style={wrapperStyle}>
        <Text style={[resolvedStyle, lineThrough]} {...rest} />
      </View>
    )
  }

  const overrideDecoration: Partial<TextStyle> = textDecorationLine ? { textDecorationLine } : {}

  return (
    <Text
      style={[
        baseByVariant[variant],
        overrideColor,
        overrideSize,
        overrideWeight,
        overrideLetterSpacing,
        overrideDecoration,
        overrideTextTransform,
        style
      ]}
      {...rest}
    />
  )
}

const styles = StyleSheet.create({
  primary: { fontSize: 16, lineHeight: 24, fontFamily: 'InterTight-Regular', color: '#EDEAE4', letterSpacing: -0.5 },
  secondary: { fontSize: 16, lineHeight: 24, color: '#8A8680', fontFamily: 'InterTight-Regular' },
  title: { fontSize: 36, lineHeight: 38, color: '#EDEAE4', fontFamily: 'InterTight-Bold', letterSpacing: -1.44 },
  subtitle: { lineHeight: 32, fontSize: 22, color: '#EDEAE4', fontFamily: 'InterTight-SemiBold', letterSpacing: -0.3 },
  mono: { color: '#8A8680', fontFamily: 'JetBrainsMono-Medium', letterSpacing: -0.07 }
} as const)

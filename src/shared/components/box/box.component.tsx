import React, { ReactNode } from 'react'
import { ScrollView, StyleProp, View, ViewProps,ViewStyle } from 'react-native'

import { theme as defaultTheme } from '@src/shared/constants/theme'

export type SpacingValue = number | keyof (typeof defaultTheme)['spacing']

export interface BoxProps extends ViewProps {
  h?: SpacingValue
  w?: SpacingValue
  m?: SpacingValue
  mt?: SpacingValue
  mr?: SpacingValue
  mb?: SpacingValue
  ml?: SpacingValue
  p?: SpacingValue
  pt?: SpacingValue
  pr?: SpacingValue
  pb?: SpacingValue
  pl?: SpacingValue
  position?: 'absolute' | 'relative'
  bg?: keyof (typeof defaultTheme)['colors']
  flex?: number
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  flexShrink?: number
  flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse'
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
  gap?: SpacingValue
  scrollable?: boolean
  showsVerticalScrollIndicator?: boolean
  testID?: string
  children?: ReactNode
  style?: StyleProp<ViewStyle>
}

export const Box = React.forwardRef<View, BoxProps>((props, ref) => {
  const {
    h,
    w,
    m,
    mt,
    mr,
    mb,
    ml,
    p,
    pt,
    pr,
    pb,
    pl,
    bg,
    position,
    flex,
    flexDirection,
    flexShrink,
    flexWrap,
    alignItems,
    justifyContent,
    gap,
    scrollable,
    children,
    style,
    showsVerticalScrollIndicator = false,
    ...rest
  } = props

  const theme = defaultTheme

  const resolveToken = (token: keyof typeof theme.spacing): number => {
    const raw = theme.spacing[token]
    if (typeof raw === 'string') {
      return parseFloat(raw)
    }
    return raw
  }

  const getSpacing = (value?: SpacingValue): number | undefined => {
    if (value === undefined) return undefined
    if (typeof value === 'number') return value * 4
    return resolveToken(value)
  }

  const getBgColor = (color: keyof (typeof defaultTheme)['colors'] | string): string | undefined => {
    if (typeof color === 'string' && color.includes('.')) {
      const [colorKey, colorShade] = color.split('.')
      const shadeObject = theme.colors[colorKey as keyof typeof theme.colors]

      if (shadeObject && typeof shadeObject === 'object') {
        return shadeObject[colorShade as keyof typeof shadeObject] as string
      }
    } else if (typeof color === 'string' && color in theme.colors) {
      return theme.colors[color as keyof typeof theme.colors] as string
    }
    return undefined
  }

  const boxStyle: ViewStyle = {
    ...(h !== undefined && { height: getSpacing(h) }),
    ...(w !== undefined && { width: getSpacing(w) }),
    ...(m !== undefined && { margin: getSpacing(m) }),
    ...(mt !== undefined && { marginTop: getSpacing(mt) }),
    ...(mr !== undefined && { marginRight: getSpacing(mr) }),
    ...(mb !== undefined && { marginBottom: getSpacing(mb) }),
    ...(ml !== undefined && { marginLeft: getSpacing(ml) }),
    ...(p !== undefined && { padding: getSpacing(p) }),
    ...(pt !== undefined && { paddingTop: getSpacing(pt) }),
    ...(pr !== undefined && { paddingRight: getSpacing(pr) }),
    ...(pb !== undefined && { paddingBottom: getSpacing(pb) }),
    ...(pl !== undefined && { paddingLeft: getSpacing(pl) }),
    ...(gap !== undefined && { gap: getSpacing(gap) }),
    ...(position && { position }),
    ...(flex !== undefined && { flex }),
    ...(flexDirection && { flexDirection }),
    ...(flexShrink !== undefined && { flexShrink }),
    ...(flexWrap && { flexWrap }),
    ...(alignItems && { alignItems }),
    ...(justifyContent && { justifyContent }),
    ...(bg && { backgroundColor: getBgColor(bg) })
  }

  if (scrollable) {
    return (
      <ScrollView
        ref={ref as React.Ref<ScrollView>}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        style={[boxStyle, style]}
        {...rest}
      >
        {children}
      </ScrollView>
    )
  }

  return (
    <View ref={ref} style={[boxStyle, style]} {...rest}>
      {children}
    </View>
  )
})

Box.displayName = 'Box'

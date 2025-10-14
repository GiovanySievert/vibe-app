import { colors, sizes, spacing, typography, weights } from './tokens'

export type Color = keyof typeof colors
export type Spacing = keyof typeof spacing
// export type BorderRadius = keyof typeof borderRadius
export type FontSize = keyof typeof typography
// export type FontFamily = keyof typeof fontFamily
// export type FontWeight = keyof typeof fontWeights
// export type BoxShadow = keyof typeof boxShadow
// export type BreakPointsValue = keyof typeof breakPointsWidth

export type AppTheme = {
  colors: typeof colors
  typography: typeof typography
  sizes: typeof sizes
  weights: typeof weights
  spacing: typeof spacing
}

export const theme: AppTheme = {
  colors,
  sizes,
  typography,
  weights,
  spacing
}

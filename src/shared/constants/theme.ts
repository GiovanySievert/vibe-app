import { colors, weights, typography, spacing } from './tokens'

export type AppTheme = {
  colors: typeof colors
  typography: typeof typography
  weights: typeof weights
  spacing: typeof spacing
}

export const theme: AppTheme = {
  colors,
  typography,
  weights,
  spacing
}

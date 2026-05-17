import { theme } from '@src/shared/constants/theme'

export const space = (value: keyof typeof theme.spacing) => Number.parseFloat(theme.spacing[value])

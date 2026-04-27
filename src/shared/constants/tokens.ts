export const colors = {
  background: '#111111',
  backgroundSecondary: '#1A1A1A',

  primary: '#6FE8A8',
  primaryGlow: 'rgba(45,90,61,0.25)',

  success: '#2D5A3D',
  warning: '#C8A84B',
  error: '#C0392B',
  info: '#4A7C59',

  textPrimary: '#EDEAE4',
  textSecondary: '#8a8680',

  border: 'rgba(255,255,255,0.08)'
} as const

export const typography = {
  lineHeights: { tight: 1.1, normal: 1.4, relaxed: 1.6 }
}

export const sizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  '2xl': 28,
  '3xl': 32,
  '4xl': '36'
}

export const weights = {
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const
} as const

export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px'
} as const

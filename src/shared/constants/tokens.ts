export const colors = {
  background: '#121212',
  backgroundSecondary: '#1C1C1C',
  surface: '#1E1E1E',
  primary: '#6B1FA2',
  accent: '#39FF14',
  warning: '#FF9800',
  textPrimary: '#EAEAEA',
  textSecondary: '#9E9E9E',
  border: '#8A8A8A',
  borderFocus: '#39FF14'

} as const

export const typography = {
  sizes: { xs: 12, sm: 14, md: 16, lg: 18, xl: 22, '2xl': 28 },
  lineHeights: { tight: 1.1, normal: 1.4, relaxed: 1.6 }
}

export const weights = {
  regular: '400' as const,
  medium: '500' as const,
  bold: '700'
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

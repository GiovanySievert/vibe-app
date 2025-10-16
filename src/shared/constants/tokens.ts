export const colors = {
  background: '#0A0A0F',
  backgroundSecondary: '#13131A',
  backgroundTertiary: '#1A1A24',
  surface: '#1E1E2D',
  surfaceHover: '#252534',

  primary: '#4FAEA8',
  primaryLight: '#6FCCC6',
  primaryDark: '#3A8C87',
  primaryGlow: 'rgba(79, 174, 168, 0.3)',

  accent: '#FF3B9A',
  accentSecondary: '#8B5CF6',
  accentTertiary: '#FFD600',
  neonGreen: '#39FF14',
  neonBlue: '#00F0FF',

  gradientPrimary: ['#4FAEA8', '#8B5CF6'],
  gradientAccent: ['#FF3B9A', '#FFD600'],
  gradientNeon: ['#39FF14', '#00F0FF'],
  gradientVibe: ['#4FAEA8', '#FF3B9A', '#8B5CF6'],

  success: '#39FF14',
  warning: '#FFD600',
  error: '#FF3B9A',
  info: '#00F0FF',

  textPrimary: '#F5F5F7',
  textSecondary: '#A0A0AB',
  textTertiary: '#6B6B76',
  textAccent: '#4FAEA8',
  textMuted: '#4A4A54',

  border: '#2A2A38',
  borderLight: '#353544',
  borderFocus: '#4FAEA8',
  borderAccent: '#FF3B9A',
  divider: '#1F1F2C',

  glassBackground: 'rgba(30, 30, 45, 0.7)',
  glassBorder: 'rgba(79, 174, 168, 0.2)',
  overlay: 'rgba(10, 10, 15, 0.85)',
  overlayLight: 'rgba(10, 10, 15, 0.6)',

  star: '#FFD600',
  starInactive: '#3A3A44',

  like: '#FF3B9A',
  comment: '#00F0FF',
  share: '#8B5CF6',
  bookmark: '#FFD600',

  shadowPrimary: 'rgba(79, 174, 168, 0.4)',
  shadowAccent: 'rgba(255, 59, 154, 0.4)',
  shadowNeon: 'rgba(57, 255, 20, 0.3)',
  shadowDark: 'rgba(0, 0, 0, 0.5)'
} as const

export type ColorKey = keyof typeof colors

export const typography = {
  lineHeights: { tight: 1.1, normal: 1.4, relaxed: 1.6 }
}

export const sizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  '2xl': 28
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

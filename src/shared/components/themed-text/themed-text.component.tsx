import { StyleSheet, Text, type TextProps } from 'react-native'

import { theme } from '@src/shared/constants/theme'

export type ThemedTextProps = TextProps & {
  weight?: any
  size?: any
  color?: string
  type?: 'default' | 'title' | 'defaultSemiBold' | 'bold' | 'subtitle' | 'link' | 'sm'
}

export function ThemedText({ style, type = 'default', ...rest }: ThemedTextProps) {
  const color = theme.colors.textPrimary

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'bold' ? styles.bold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'sm' ? styles.sm : undefined,
        style
      ]}
      {...rest}
    />
  )
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Urbanist-Regular'
  },
  bold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    fontFamily: 'Urbanist-Bold'
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
    fontFamily: 'Urbanist-bold'
  },
  subtitle: {
    fontSize: 20,
    fontFamily: 'Urbanist-semibold'
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#fff'
  },
  sm: {
    lineHeight: 30,
    fontSize: 12,
    color: theme.colors.textSecondary
  }
})

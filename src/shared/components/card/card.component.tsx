import React, { PropsWithChildren } from 'react'
import { StyleSheet } from 'react-native'

import { theme } from '@src/shared/constants/theme'

import { Box, BoxProps } from '../box'

type CardProps = PropsWithChildren<BoxProps>

export const Card: React.FC<CardProps> = ({ children, style, ...props }) => {
  return (
    <Box {...props} style={[styles.card, style]}>
      {children}
    </Box>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.backgroundTertiary,
    flex: 1,
    borderColor: theme.colors.primaryGlow,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12
  }
})

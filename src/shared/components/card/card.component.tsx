import React, { PropsWithChildren } from 'react'
import { StyleSheet } from 'react-native'

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
    backgroundColor: 'transparent',
    flex: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12
  }
})

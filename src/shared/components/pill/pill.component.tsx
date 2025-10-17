import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

import { theme } from '@src/shared/constants/theme'

import { Box } from '../box'
import { ThemedText } from '../themed-text'

type PillProps = {
  label: string
  onPress?: () => void
}

export const Pill: React.FC<PillProps> = ({ label, onPress }) => {
  return (
    <Box style={styles.pill}>
      <TouchableOpacity onPress={onPress}>
        <ThemedText weight="semibold">{label}</ThemedText>
      </TouchableOpacity>
    </Box>
  )
}

const styles = StyleSheet.create({
  pill: {
    backgroundColor: theme.colors.primaryGlow,
    justifyContent: 'center',
    textAlign: 'center',
    borderRadius: 12,
    height: 32,
    paddingVertical: 4,
    paddingHorizontal: 10
  }
})

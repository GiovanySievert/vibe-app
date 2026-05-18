import React from 'react'
import { StyleSheet } from 'react-native'

import { theme } from '@src/shared/constants/theme'

import { Box } from '../box'
import { ThemedText } from '../themed-text'
import { Touchable } from '../touchable'

type PillProps = {
  label: string
  textSize?: 'sm' | 'md' | 'lg'
  onPress?: () => void
  selected?: boolean
  accessibilityLabel?: string
}

export const Pill: React.FC<PillProps> = ({ label, textSize = 'md', onPress, selected, accessibilityLabel }) => {
  const isInteractive = !!onPress

  return (
    <Box style={styles.pill}>
      <Touchable
        onPress={onPress}
        disabled={!isInteractive}
        accessible={isInteractive}
        accessibilityRole={isInteractive ? 'button' : undefined}
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityState={isInteractive ? { selected: !!selected } : undefined}
      >
        <ThemedText weight="semibold" size={textSize}>
          {label}
        </ThemedText>
      </Touchable>
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

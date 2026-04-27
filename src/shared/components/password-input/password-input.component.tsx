import React from 'react'
import { StyleSheet } from 'react-native'

import { theme } from '@src/shared/constants/theme'
import { getPasswordStrength } from '@src/shared/utils'

import { Box } from '../box'
import { Input } from '../input'
import { ThemedText } from '../themed-text'

type PasswordInputProps = {
  value: string
  onChange: (value: string) => void
  errorMessage?: string
  label?: string
}

export const PasswordInput: React.FC<PasswordInputProps> = ({ value, onChange, errorMessage, label = 'senha' }) => {
  const strength = getPasswordStrength(value)

  return (
    <Box gap={3}>
      <Input
        label={label}
        value={value}
        onChange={({ nativeEvent }) => onChange(nativeEvent.text)}
        errorMessage={errorMessage}
        secureTextEntry
      />
      <ThemedText variant="mono" size="sm" color="textSecondary">
        mínimo 8 caracteres · uma letra maiúscula e um número
      </ThemedText>
      <Box flexDirection="row" gap={1}>
        {[0, 1, 2, 3].map((i) => (
          <Box key={i} flex={1} style={[styles.strengthBar, i < strength && styles.strengthBarActive]} />
        ))}
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  strengthBar: {
    height: 3,
    borderRadius: 2,
    backgroundColor: theme.colors.border
  },
  strengthBarActive: {
    backgroundColor: theme.colors.primary
  }
})

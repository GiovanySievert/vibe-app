import React from 'react'
import { StyleSheet, TextInputProps } from 'react-native'

import { theme } from '@src/shared/constants/theme'
import { getPasswordStrength } from '@src/shared/utils'

import { useAppTranslation } from '../../i18n'
import { Box } from '../box'
import { Input } from '../input'
import { ThemedText } from '../themed-text'

type PasswordInputProps = {
  value: string
  onChange: (value: string) => void
  errorMessage?: string
  label?: string
} & Pick<TextInputProps, 'autoComplete' | 'textContentType' | 'keyboardType' | 'inputMode' | 'autoFocus'>

export const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  errorMessage,
  label,
  keyboardType = 'default',
  autoComplete = 'off',
  textContentType = 'none',
  inputMode,
  autoFocus
}) => {
  const { t } = useAppTranslation()
  const strength = getPasswordStrength(value)

  return (
    <Box gap={3}>
      <Input
        label={label ?? t('common.password.label')}
        value={value}
        onChange={({ nativeEvent }) => onChange(nativeEvent.text)}
        errorMessage={errorMessage}
        secureTextEntry
        keyboardType={keyboardType}
        inputMode={inputMode}
        autoComplete={autoComplete}
        textContentType={textContentType}
        autoFocus={autoFocus}
      />
      <ThemedText variant="mono" size="sm" color="textSecondary">
        {t('common.password.requirements')}
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

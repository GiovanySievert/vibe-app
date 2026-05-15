import React, { forwardRef } from 'react'
import { TextInput } from 'react-native'

import { Box, Input, ThemedText } from '@src/shared/components'

type UsernameFieldProps = {
  value: string
  onChangeText: (value: string) => void
  onBlur?: () => void
  available: boolean | null
  errorMessage?: string
  label?: string
  autoFocus?: boolean
}

export const UsernameField = forwardRef<TextInput, UsernameFieldProps>(
  ({ value, onChangeText, onBlur, available, errorMessage, label = 'usuário', autoFocus }, ref) => {
    return (
      <Box gap={2}>
        <Input
          ref={ref}
          label={label}
          value={value}
          onChange={({ nativeEvent }) => onChangeText(nativeEvent.text)}
          errorMessage={errorMessage}
          keyboardType="default"
          autoCapitalize="none"
          autoComplete="username"
          textContentType="username"
          autoFocus={autoFocus}
          onBlur={onBlur}
          endIconName={available === true ? 'Check' : undefined}
          maxLength={20}
        />
        {available === true && value.length > 0 && (
          <ThemedText variant="mono" size="sm" color="textSecondary">
            vibes.app/{value} · disponível
          </ThemedText>
        )}
      </Box>
    )
  }
)

UsernameField.displayName = 'UsernameField'

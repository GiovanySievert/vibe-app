import React, { useEffect, useRef, useState } from 'react'
import { Pressable, StyleSheet, TextInput } from 'react-native'

import { theme } from '@src/shared/constants/theme'
import { useAppTranslation } from '@src/shared/i18n'

import { Box } from '../box'
import { ThemedText } from '../themed-text'

const spacingValue = (key: keyof typeof theme.spacing) => Number.parseFloat(theme.spacing[key])

type OtpInputProps = {
  value: string
  onChangeText: (value: string) => void
  errorMessage?: string
  autoFocus?: boolean
  onComplete?: (value: string) => void
  length?: number
  disabled?: boolean
}

export const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChangeText,
  errorMessage,
  autoFocus = false,
  onComplete,
  length = 6,
  disabled = false
}) => {
  const { t } = useAppTranslation()
  const inputRef = useRef<TextInput>(null)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (!autoFocus || disabled) return

    const timeoutId = setTimeout(() => {
      inputRef.current?.focus()
    }, 350)

    return () => clearTimeout(timeoutId)
  }, [autoFocus, disabled])

  const handleChangeText = (nextValue: string) => {
    if (disabled) return

    const sanitizedValue = nextValue.replace(/\D/g, '').slice(0, length)
    onChangeText(sanitizedValue)

    if (sanitizedValue.length === length && value.length < length) {
      onComplete?.(sanitizedValue)
    }
  }

  const focusInput = () => {
    if (disabled) return
    inputRef.current?.focus()
  }

  const activeIndex = isFocused ? Math.min(value.length, length - 1) : -1

  return (
    <Box>
      <Pressable
        onPress={focusInput}
        disabled={disabled}
        accessibilityRole="text"
        accessibilityLabel={t('common.verificationCode')}
        accessibilityHint={t('common.verificationCodeHint', { length })}
      >
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={handleChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={!disabled}
          maxLength={length}
          keyboardType="number-pad"
          inputMode="numeric"
          textContentType="oneTimeCode"
          autoComplete="one-time-code"
          autoCorrect={false}
          autoCapitalize="none"
          caretHidden
          style={styles.hiddenInput}
        />

        <Box flexDirection="row" gap={2}>
          {Array.from({ length }).map((_, index) => {
            const digit = value[index]
            const isActive = index === activeIndex && !disabled
            const hasError = !!errorMessage

            return (
              <Box
                key={index}
                alignItems="center"
                justifyContent="center"
                style={[styles.digitBox, isActive && styles.digitBoxActive, hasError && styles.digitBoxError]}
                accessibilityLabel={t('common.digitA11y', {
                  index: index + 1,
                  length,
                  value: digit ? t('common.digitValue', { digit }) : t('common.digitEmpty')
                })}
              >
                <ThemedText variant="mono" size="2xl" color="textPrimary" weight="bold">
                  {digit}
                </ThemedText>
              </Box>
            )
          })}
        </Box>
      </Pressable>

      {!!errorMessage && (
        <Box mt={2} accessibilityLiveRegion="polite" accessibilityRole="alert">
          <ThemedText size="sm" weight="medium" color="error">
            {errorMessage}
          </ThemedText>
        </Box>
      )}
    </Box>
  )
}

const styles = StyleSheet.create({
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0
  },
  digitBox: {
    flex: 1,
    maxWidth: spacingValue(12),
    minWidth: spacingValue(10),
    height: spacingValue(16) + spacingValue(4),
    borderWidth: 1,
    borderRadius: spacingValue(3),
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background
  },
  digitBoxActive: {
    borderColor: theme.colors.primary
  },
  digitBoxError: {
    borderColor: theme.colors.error
  }
})

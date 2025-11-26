import React, { useEffect, useState } from 'react'
import { StyleSheet, TextInputProps, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'

import { icons } from 'lucide-react-native'

import { theme } from '@src/shared/constants/theme'

import { AnimatedBox } from '../animated-box'
import { Box } from '../box'
import { ThemedIcon } from '../themed-icon'
import { ThemedText } from '../themed-text'

type IconName = keyof typeof icons

interface InputProps extends Omit<TextInputProps, 'placeholder'> {
  label?: string
  errorMessage?: string
  startIconName?: string
  startIconColor?: string
  endIconName?: string
  disabled?: boolean
  isClearable?: boolean
  placeholder?: string | React.ReactElement
  onEndIconPress?: () => void
  onClear?: () => void
  onPress?: () => void
}

export const FakeInput = ({
  label,
  errorMessage,
  startIconName,
  startIconColor,
  endIconName,
  onEndIconPress,
  disabled = false,
  isClearable = false,
  onClear,
  placeholder,
  onPress,
  ...rest
}: InputProps) => {
  const [localInputValue, setLocalInputValue] = useState('')
  const hasSecondBox = (isClearable && localInputValue) || (!isClearable && endIconName)

  const handleClear = () => {
    setLocalInputValue('')
    if (rest.onChangeText) {
      rest.onChangeText('')
    }
    if (onClear) {
      onClear()
    }
  }

  useEffect(() => {
    setLocalInputValue(rest.value || '')
  }, [rest.value])

  return (
    <Box>
      {label && (
        <Box mb={2}>
          <ThemedText size="sm" weight="semibold" color={!disabled ? 'textPrimary' : 'textSecondary'}>
            {label}
          </ThemedText>
        </Box>
      )}
      <TouchableWithoutFeedback onPress={onPress} style={{ flex: 1 }}>
        <Box style={[styles.input, errorMessage && styles.inputError]} testID="fake-input-field--fake-input">
          <Box flexDirection="row" alignItems="center" justifyContent="space-between" flex={1}>
            <Box flexDirection="row" alignItems="center" flex={8}>
              {startIconName && (
                <Box style={{ zIndex: 10 }} mr={3}>
                  <ThemedIcon
                    name={startIconName as IconName}
                    size={18}
                    color={startIconColor}
                    testID="start-icon--input"
                  />
                </Box>
              )}
              <Box flexShrink={1}>
                {placeholder &&
                  !rest.value &&
                  (typeof placeholder === 'string' ? (
                    <ThemedText color="textPrimary">{placeholder}</ThemedText>
                  ) : (
                    placeholder
                  ))}
                {rest.value && (
                  <ThemedText color="textPrimary" numberOfLines={1} ellipsizeMode="tail">
                    {rest.value}
                  </ThemedText>
                )}
              </Box>
            </Box>
            {hasSecondBox && (
              <Box flex={1}>
                {isClearable && localInputValue && (
                  <TouchableOpacity onPress={handleClear} style={{ zIndex: 10 }}>
                    <ThemedIcon name="X" size={18} color="textSecondary" testID="clear-button--input" />
                  </TouchableOpacity>
                )}
                {!isClearable && endIconName && (
                  <TouchableOpacity
                    onPress={onEndIconPress}
                    style={{ position: 'absolute', right: 0, zIndex: 10, bottom: -10 }}
                  >
                    <ThemedIcon
                      name={endIconName as IconName}
                      size={18}
                      color="textSecondary"
                      testID="end-icon--input"
                    />
                  </TouchableOpacity>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </TouchableWithoutFeedback>
      {errorMessage && (
        <AnimatedBox isVisible={!!errorMessage}>
          <Box mt={2}>
            <ThemedText size="sm" weight="semibold" color="error">
              {errorMessage}
            </ThemedText>
          </Box>
        </AnimatedBox>
      )}
    </Box>
  )
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 12,
    paddingRight: 12,
    height: 44,
    fontSize: 16,
    borderColor: '#D1D5DB',
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.backgroundSecondary,
    justifyContent: 'center'
  },
  inputError: {
    borderColor: '#EF4444'
  },
  hasStartIconInput: {
    paddingLeft: 40
  },
  hasEndIcon: {
    paddingRight: 40
  },
  startIconContainer: {
    position: 'absolute',
    left: 16,
    zIndex: 10,
    top: 13
  },
  endIconContainer: {
    position: 'absolute',
    right: 16,
    zIndex: 10,
    top: 13
  }
})

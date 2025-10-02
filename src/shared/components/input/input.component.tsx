import React, { forwardRef, useEffect, useState } from 'react'
import { TextInput, TextInputProps, TouchableOpacity } from 'react-native'
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

import { icons } from 'lucide-react-native'

import { Box, ThemedText } from '@src/shared/components'
import { theme } from '@src/shared/constants/theme'

import { ThemedIcon } from '../themed-icon'

type IconName = keyof typeof icons

type FocusEvent = Parameters<NonNullable<TextInputProps['onFocus']>>[0]
type BlurEvent = Parameters<NonNullable<TextInputProps['onBlur']>>[0]

export interface InputProps extends TextInputProps {
  label?: string
  errorMessage?: string
  startIconName?: string
  startIconColor?: string
  endIconName?: string
  iconType?: 'light' | 'solid'
  disabled?: boolean
  onEndIconPress?: () => void
  onClear?: () => void
  isClearable?: boolean
  onFocusCallback?: TextInputProps['onFocus']
  onBlurCallback?: TextInputProps['onBlur']
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput)

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      errorMessage,
      startIconName,
      startIconColor,
      iconType = 'light',
      disabled = false,
      isClearable = false,
      onClear,
      onBlurCallback,
      onFocusCallback,
      multiline,
      maxLength,
      ...rest
    },
    ref
  ) => {
    const [localInputValue, setLocalInputValue] = useState('')
    const [isFocused, setIsFocused] = useState(false)

    const borderState = useSharedValue(0)
    const errorHeight = useSharedValue(0)

    useEffect(() => {
      errorHeight.value = withTiming(errorMessage ? 35 : 0, { duration: 200 })
    }, [errorMessage, errorHeight])

    useEffect(() => {
      const next = disabled ? 0 : errorMessage ? 2 : isFocused ? 1 : 0

      borderState.value = withTiming(next, { duration: 300 })
    }, [disabled, errorMessage, isFocused, borderState])

    const borderStyle = useAnimatedStyle(() => {
      const color = interpolateColor(
        borderState.value,
        [0, 1, 2],
        [theme.colors.primary, theme.colors.backgroundSecondary, theme.colors.warning]
      )
      return { borderColor: color }
    })

    const errorStyle = useAnimatedStyle(() => ({
      height: errorHeight.value
    }))

    const onFocus = (e: FocusEvent) => {
      setIsFocused(true)
      onFocusCallback?.(e)
      rest.onFocus?.(e)
    }

    const onBlur = (e: BlurEvent) => {
      setIsFocused(false)
      onBlurCallback?.(e)
      rest.onBlur?.(e)
    }

    const handleClear = () => {
      if (disabled) return
      setLocalInputValue('')
      rest.onChangeText?.('')
      onClear?.()
    }

    useEffect(() => {
      setLocalInputValue(rest.value || '')
    }, [rest.value])

    return (
      <Box style={{ flexGrow: 1 }}>
        {label && (
          <Box mb={2}>
            <ThemedText size="sm" weight="semibold" color={!disabled ? 'gray.900' : 'gray.400'}>
              {label}
            </ThemedText>
          </Box>
        )}

        <Box justifyContent="center">
          {startIconName && (
            <Box style={{ position: 'absolute', left: 16, zIndex: 10 }}>
              <ThemedIcon
                name={startIconName as IconName}
                size={18}
                color={startIconColor}
                testID="start-icon--input"
                type={iconType}
              />
            </Box>
          )}

          <AnimatedTextInput
            value={localInputValue}
            onFocus={!disabled ? onFocus : undefined}
            onBlur={!disabled ? onBlur : undefined}
            style={[
              {
                borderWidth: 1,
                borderRadius: 8,
                paddingLeft: startIconName ? 40 : 12,
                paddingRight: isClearable ? 40 : 12,
                height: 44
              },
              borderStyle
            ]}
            placeholderTextColor={theme.colors.textSecondary}
            textAlign="left"
            textAlignVertical="top"
            editable={!disabled}
            ref={ref}
            autoCorrect={false}
            autoCapitalize="none"
            maxLength={maxLength || 128}
            multiline={multiline}
            // isTextArea={!!multiline}
            // startIconName={startIconName}
            // isClearable={isClearable}
            testID="input-field"
            {...rest}
          />

          {isClearable && localInputValue && !disabled && (
            <TouchableOpacity
              onPress={handleClear}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{ position: 'absolute', right: 16, zIndex: 10 }}
            >
              <ThemedIcon name={'X'} size={18} testID="clear-button--input" />
            </TouchableOpacity>
          )}
        </Box>

        <Box>
          {errorMessage ? (
            <Box mt={2}>
              <ThemedText size="sm" weight="semibold" color="danger.600">
                {errorMessage}
              </ThemedText>
            </Box>
          ) : null}
        </Box>
      </Box>
    )
  }
)

import React, { forwardRef, useEffect, useState } from 'react'
import { StyleSheet, TextInput, TextInputProps, TouchableOpacity } from 'react-native'
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

import { icons } from 'lucide-react-native'

import { theme } from '@src/shared/constants/theme'
import { HIT_SLOP } from '@src/shared/utils'

import { AnimatedBox } from '../animated-box'
import { Box } from '../box'
import { ThemedIcon } from '../themed-icon'
import { ThemedText } from '../themed-text'

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
  multilineHeight?: number
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
      multilineHeight = 100,
      maxLength,
      secureTextEntry,
      ...rest
    },
    ref
  ) => {
    const [localInputValue, setLocalInputValue] = useState('')
    const [isFocused, setIsFocused] = useState(false)
    const [secureTextEntryisShowing, setSecureTextEntryisShowing] = useState<boolean>(!!secureTextEntry)

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
        [theme.colors.primaryGlow, theme.colors.textPrimary, theme.colors.error]
      )
      return { borderColor: color }
    })

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
      <Box flexGrow={1}>
        {label && (
          <Box mb={-1}>
            <ThemedText size="sm" weight="medium" color={!disabled ? 'textSecondary' : 'textSecondary'}>
              {label}
            </ThemedText>
          </Box>
        )}

        <Box justifyContent="center">
          {startIconName && (
            <Box style={style.startIconContainer}>
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
              style.input,
              borderStyle,
              startIconColor && style.hasStartIconInput,
              isClearable && style.hasEndIcon,
              multiline && { height: multilineHeight, paddingVertical: 12 }
            ]}
            placeholderTextColor={theme.colors.textSecondary}
            textAlign="left"
            textAlignVertical="top"
            editable={!disabled}
            ref={ref}
            autoCorrect={false}
            autoCapitalize="none"
            maxLength={maxLength || 72}
            multiline={multiline}
            testID="input-field"
            secureTextEntry={secureTextEntry && secureTextEntryisShowing}
            {...rest}
          />

          {isClearable && localInputValue && !disabled && (
            <TouchableOpacity onPress={handleClear} hitSlop={HIT_SLOP} style={style.endIconContainer}>
              <ThemedIcon name={'X'} size={18} testID="clear-button--input" color="textPrimary" />
            </TouchableOpacity>
          )}

          {!!localInputValue && !!secureTextEntry && (
            <TouchableOpacity
              onPress={() => setSecureTextEntryisShowing((prev) => !prev)}
              style={style.endIconContainer}
            >
              <ThemedText size="xs" weight="medium" color="textSecondary" textDecorationLine="underline">
                {secureTextEntryisShowing ? 'mostrar' : 'ocultar'}
              </ThemedText>
            </TouchableOpacity>
          )}
        </Box>

        <Box flexDirection="row" justifyContent="space-between">
          <AnimatedBox isVisible={!!errorMessage}>
            <Box mt={1}>
              <ThemedText size="sm" weight="medium" color="error">
                {errorMessage}
              </ThemedText>
            </Box>
          </AnimatedBox>

          {multiline && maxLength && (
            <Box mt={2}>
              <ThemedText size="xs" variant="mono" color="textSecondary">
                {localInputValue.length}/{maxLength}
              </ThemedText>
            </Box>
          )}
        </Box>
      </Box>
    )
  }
)

const style = StyleSheet.create({
  input: {
    borderBottomWidth: 1,
    paddingRight: 12,
    height: 44,
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    fontWeight: '500',
    letterSpacing: -0.5
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
    zIndex: 10
  },
  endIconContainer: { position: 'absolute', right: 0, zIndex: 10, color: '#fff', marginBottom: 4 }
})

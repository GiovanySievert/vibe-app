import React, { PropsWithChildren, ReactNode, useState } from 'react'
import { ActivityIndicator, GestureResponderEvent, Pressable, PressableProps, View } from 'react-native'

import { theme } from '@src/shared/constants/theme'

type ButtonVariant = 'solid' | 'soft' | 'outline' | 'outline-strong' | 'ghost' | 'text' | 'icon'
type ButtonType = 'primary' | 'secondary' | 'danger' | 'warning' | 'black'
type IconWeight = 'regular' | 'light' | 'solid' | 'brand' | 'duotone' | 'thin'

type ButtonProps = {
  children: ReactNode
  variant?: ButtonVariant
  type?: ButtonType
  loading?: boolean
  disabled?: boolean
  startIconName?: string
  endIconName?: string
  startIconType?: IconWeight
  endIconType?: IconWeight
} & PressableProps

export const Button = React.forwardRef<View, PropsWithChildren<ButtonProps>>(
  (
    { children, variant = 'solid', type = 'primary', startIconType = 'light', endIconType = 'light', testID, ...props },
    ref
  ) => {
    const [pressed, setPressed] = useState(false)

    const disabled = props.loading || props.disabled

    const handlePressIn = (event: GestureResponderEvent) => {
      setPressed(true)
      props.onPressIn?.(event)
    }

    const handlePressOut = (event: GestureResponderEvent) => {
      setPressed(false)
      props.onPressOut?.(event)
    }

    const loadingColor = !disabled ? theme.colors.primary : theme.colors.textSecondary

    const getButtonStyle = (variant: ButtonVariant, type: ButtonType, disabled?: boolean) => {
      const colors = theme.colors

      const typeColors = {
        primary: colors.primary,
        secondary: colors.textSecondary,
        danger: colors.danger || '#ff4d4f',
        warning: colors.warning || '#faad14',
        black: colors.black || '#000'
      }

      const base: any = {
        height: 44,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: disabled ? 0.5 : 1
      }

      switch (variant) {
        case 'solid':
          return {
            ...base,
            backgroundColor: typeColors[type],
            borderWidth: 0
          }
        case 'soft':
          return {
            ...base,
            backgroundColor: `${typeColors[type]}33`,
            borderWidth: 0
          }
        case 'outline':
          return {
            ...base,
            borderWidth: 1,
            borderColor: typeColors[type],
            backgroundColor: 'transparent'
          }
        case 'outline-strong':
          return {
            ...base,
            borderWidth: 2,
            borderColor: typeColors[type],
            backgroundColor: 'transparent'
          }
        case 'ghost':
          return {
            ...base,
            backgroundColor: 'transparent'
          }
        case 'text':
          return {
            ...base,
            backgroundColor: 'transparent',
            height: 'auto',
            paddingVertical: 4
          }
        case 'icon':
          return {
            ...base,
            height: 40,
            width: 40,
            backgroundColor: typeColors[type],
            borderRadius: 9999
          }
        default:
          return base
      }
    }

    return (
      <Pressable
        {...props}
        ref={ref}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        testID={testID || 'button-container--button'}
        style={[getButtonStyle(variant, type, disabled), pressed && { opacity: 0.7 }]}
      >
        {props.loading ? <ActivityIndicator color={loadingColor} /> : children}
      </Pressable>
    )
  }
)

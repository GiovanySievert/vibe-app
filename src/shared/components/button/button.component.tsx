import React, { PropsWithChildren, useState } from 'react'
import { ActivityIndicator, Button as NativeButton, GestureResponderEvent, PressableProps, View } from 'react-native'

import { theme } from '@src/shared/constants/theme'

type ButtonVariant = 'solid' | 'soft' | 'outline' | 'outline-strong' | 'ghost' | 'text' | 'icon'
type ButtonType = 'primary' | 'secondary' | 'danger' | 'warning' | 'black'
type IconWeight = 'regular' | 'light' | 'solid' | 'brand' | 'duotone' | 'thin'

type ButtonProps = {
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
  ({ variant = 'solid', type = 'primary', startIconType = 'light', endIconType = 'light', testID, ...props }, ref) => {
    const [pressed, setPressed] = useState(false)

    const disabled = typeof props.disabled === 'boolean' ? props.loading || props.disabled : false

    const handlePressIn = (event: GestureResponderEvent) => {
      setPressed(true)
      if (!props.loading && typeof props.onPressIn === 'function') {
        props.onPressIn(event)
      }
    }

    const handlePressOut = (event: GestureResponderEvent) => {
      setPressed(false)
      if (!props.loading && typeof props.onPressOut === 'function') {
        props.onPressOut(event)
      }
    }

    const loadingColor = !disabled ? theme.colors.primary : theme.colors.textSecondary

    return (
      <NativeButton
        {...props}
        variant={variant}
        type={type}
        state={{ pressed }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        testID={testID || 'button-container--button'}
        ref={ref}
      >
        {props.loading && <ActivityIndicator />}
      </NativeButton>
    )
  }
)

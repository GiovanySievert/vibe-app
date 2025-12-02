import React, { PropsWithChildren, ReactNode, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  GestureResponderEvent,
  Pressable,
  PressableProps,
  StyleSheet,
  View,
  ViewStyle
} from 'react-native'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

import { icons } from 'lucide-react-native'

import { theme } from '@src/shared/constants/theme'

import { ThemedIcon } from '../themed-icon'

type ButtonVariant = 'solid' | 'soft' | 'outline' | 'outline-strong' | 'ghost' | 'text' | 'icon'
type ButtonType = 'primary' | 'secondary' | 'danger' | 'warning'
type IconName = keyof typeof icons

type ButtonProps = {
  children: ReactNode
  variant?: ButtonVariant
  type?: ButtonType
  loading?: boolean
  disabled?: boolean
  startIconName?: IconName
  endIconName?: IconName
  flex?: number
} & PressableProps

export const Button = React.forwardRef<View, PropsWithChildren<ButtonProps>>(
  ({ children, variant = 'solid', type = 'primary', testID, loading, disabled, flex, ...props }, ref) => {
    const [pressed, setPressed] = useState(false)

    const childrenOpacity = useSharedValue(loading ? 0 : 1)
    const loaderOpacity = useSharedValue(loading ? 1 : 0)
    const loaderScale = useSharedValue(loading ? 1 : 0.8)

    const animatedChildren = useAnimatedStyle(() => ({
      opacity: childrenOpacity.value
    }))

    const animatedLoader = useAnimatedStyle(() => ({
      opacity: loaderOpacity.value,
      transform: [{ scale: loaderScale.value }]
    }))

    const handlePressIn = (event: GestureResponderEvent) => {
      setPressed(true)
      props.onPressIn?.(event)
    }

    const handlePressOut = (event: GestureResponderEvent) => {
      setPressed(false)
      props.onPressOut?.(event)
    }

    const getButtonStyle = (variant: ButtonVariant, type: ButtonType, disabled?: boolean): ViewStyle => {
      const colors = theme.colors
      const typeColors: Record<ButtonType, string> = {
        primary: colors.primary,
        secondary: colors.textSecondary,
        danger: colors.error,
        warning: colors.warning
      }

      const base: ViewStyle = {
        height: 44,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: disabled ? 0.5 : 1,
        paddingHorizontal: 16,
        flexDirection: 'row'
      }

      switch (variant) {
        case 'solid':
          return { ...base, backgroundColor: typeColors[type] }
        case 'soft':
          return { ...base, backgroundColor: typeColors[type] }
        case 'outline':
          return { ...base, borderWidth: 1, borderColor: typeColors[type], backgroundColor: 'transparent' }
        case 'outline-strong':
          return { ...base, borderWidth: 2, borderColor: typeColors[type], backgroundColor: 'transparent' }
        case 'ghost':
          return { ...base, backgroundColor: 'transparent' }
        case 'text':
          return { ...base, backgroundColor: 'transparent', height: undefined, paddingVertical: 4 }
        case 'icon':
          return { ...base, height: 40, width: 40, backgroundColor: typeColors[type], borderRadius: 9999 }
        default:
          return base
      }
    }

    useEffect(() => {
      if (loading) {
        childrenOpacity.value = withTiming(0, { duration: 200, easing: Easing.in(Easing.cubic) })
        loaderOpacity.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) })
        loaderScale.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) })
      } else {
        childrenOpacity.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) })
        loaderOpacity.value = withTiming(0, { duration: 200, easing: Easing.in(Easing.cubic) })
        loaderScale.value = withTiming(0.8, { duration: 200, easing: Easing.in(Easing.cubic) })
      }
    }, [loading, childrenOpacity, loaderOpacity, loaderScale])

    return (
      <Pressable
        {...props}
        ref={ref}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        testID={testID || 'button-container--button'}
        style={[getButtonStyle(variant, type, disabled), pressed && { opacity: 0.7 }, flex !== undefined && { flex }, props.style]}
      >
        {props.startIconName && <ThemedIcon name={props.startIconName} />}

        <Animated.View style={[styles.viewContainer, animatedChildren]}>
          {children}
        </Animated.View>

        <Animated.View pointerEvents="none" style={[styles.loaderContainer, animatedLoader]}>
          <ActivityIndicator color={theme.colors.info} />
        </Animated.View>

        {props.endIconName && <ThemedIcon name={props.endIconName} />}
      </Pressable>
    )
  }
)

const styles = StyleSheet.create({
  viewContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 24
  },
  loaderContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

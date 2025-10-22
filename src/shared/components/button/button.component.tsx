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
} & PressableProps

export const Button = React.forwardRef<View, PropsWithChildren<ButtonProps>>(
  ({ children, variant = 'solid', type = 'primary', testID, loading, disabled, ...props }, ref) => {
    const [pressed, setPressed] = useState(false)

    const childrenOpacity = useSharedValue(loading ? 0 : 1)
    const loaderOpacity = useSharedValue(loading ? 1 : 0)
    const loaderTranslateX = useSharedValue(loading ? 0 : -20)

    const animatedChildren = useAnimatedStyle(() => ({
      opacity: childrenOpacity.value
    }))

    const animatedLoader = useAnimatedStyle(() => ({
      opacity: loaderOpacity.value,
      transform: [{ translateX: loaderTranslateX.value }]
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
        paddingHorizontal: 12,
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
        childrenOpacity.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) })
        loaderOpacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) })
        loaderTranslateX.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) })
      } else {
        loaderOpacity.value = withTiming(0, { duration: 100, easing: Easing.in(Easing.cubic) })
        loaderTranslateX.value = withTiming(-20, { duration: 500, easing: Easing.in(Easing.cubic) })
        childrenOpacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) })
      }
    }, [loading, childrenOpacity, loaderOpacity, loaderTranslateX])

    return (
      <Pressable
        {...props}
        ref={ref}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        testID={testID || 'button-container--button'}
        style={[getButtonStyle(variant, type, disabled), pressed && { opacity: 0.7 }]}
      >
        {props.startIconName && <ThemedIcon name={props.startIconName} />}

        <View style={styles.viewContainer}>
          <Animated.View pointerEvents="none" style={[styles.animatedViewContainer, animatedChildren]}>
            {children}
          </Animated.View>

          <Animated.View pointerEvents="none" style={[styles.animatedViewContainer, animatedLoader]}>
            <ActivityIndicator color={theme.colors.info} />
          </Animated.View>
        </View>

        {props.endIconName && <ThemedIcon name={props.endIconName} />}
      </Pressable>
    )
  }
)

const styles = StyleSheet.create({
  viewContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 24, marginHorizontal: 8 },
  animatedViewContainer: { position: 'absolute', left: 0, right: 0, alignItems: 'center' }
})

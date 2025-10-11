import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

import { icons } from 'lucide-react-native'

import { useToast } from '@src/app/providers'
import { theme } from '@src/shared/constants/theme'

import { ThemedIcon } from '../themed-icon'
import { ThemedText } from '../themed-text'

type ToastLevel = 'success' | 'error' | 'info' | 'warning'
type IconName = keyof typeof icons

export const Toast = () => {
  const { toast } = useToast()

  const top = useSharedValue(-100)

  const paletteByLevel: Record<
    ToastLevel,
    {
      bg: string
      border: string
      icon: IconName
      iconBg: string
      text: string
    }
  > = {
    success: {
      bg: theme.colors.primary,
      border: theme.colors.primary,
      icon: 'Check',
      iconBg: theme.colors.primary,
      text: theme.colors.primary
    },
    error: {
      bg: theme.colors.surface,
      border: theme.colors.surface,
      icon: 'X',
      iconBg: theme.colors.surface,
      text: theme.colors.surface
    },
    warning: {
      bg: theme.colors.warning,
      border: theme.colors.warning,
      icon: 'OctagonX',
      iconBg: theme.colors.warning,
      text: theme.colors.warning
    },
    info: {
      bg: theme.colors.textSecondary,
      border: theme.colors.textSecondary,
      icon: 'Info',
      iconBg: theme.colors.textSecondary,
      text: theme.colors.textSecondary
    }
  }

  useEffect(() => {
    if (toast) {
      top.value = withTiming(100, { duration: 500, easing: Easing.out(Easing.exp) })
    } else {
      top.value = withTiming(-100, { duration: 500, easing: Easing.in(Easing.exp) })
    }
  }, [toast, top])

  const animatedStyle = useAnimatedStyle(() => ({ top: top.value }))

  if (!toast) return null

  const palette = paletteByLevel[toast.level]

  return (
    <Animated.View
      style={[styles.container, animatedStyle, { backgroundColor: palette.bg, borderColor: palette.border }]}
    >
      <View style={[styles.iconWrap, { backgroundColor: palette.iconBg }]}>
        <ThemedIcon name={palette.icon} color="white" size={14} />
      </View>
      <ThemedText>{toast.message}</ThemedText>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 2,
    right: 2,
    margin: 16,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: 'rgba(0,0,0,0.8)',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
    zIndex: 99999
  },
  iconWrap: {
    height: 24,
    width: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    marginLeft: 12,
    lineHeight: 20,
    color: '#333',
    fontWeight: '600'
  }
})

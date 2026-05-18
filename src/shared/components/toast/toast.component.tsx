import React, { useEffect } from 'react'
import { Pressable, StyleSheet } from 'react-native'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { icons } from 'lucide-react-native'

import { useToast } from '@src/app/providers/toast.provider'
import { theme } from '@src/shared/constants/theme'
import { HIT_SLOP } from '@src/shared/utils'

import { Box } from '../box'
import { ThemedIcon } from '../themed-icon'
import { ThemedText } from '../themed-text'

type ToastLevel = 'success' | 'error' | 'info' | 'warning'
type IconName = keyof typeof icons

type LevelPalette = {
  bg: keyof typeof theme.colors
  border: keyof typeof theme.colors
  icon: IconName
  iconColor: keyof typeof theme.colors
}

const PALETTE_BY_LEVEL: Record<ToastLevel, LevelPalette> = {
  success: {
    bg: 'backgroundSecondary',
    border: 'primary',
    icon: 'Check',
    iconColor: 'primary'
  },
  error: {
    bg: 'backgroundSecondary',
    border: 'error',
    icon: 'X',
    iconColor: 'error'
  },
  warning: {
    bg: 'backgroundSecondary',
    border: 'warning',
    icon: 'OctagonAlert',
    iconColor: 'warning'
  },
  info: {
    bg: 'backgroundSecondary',
    border: 'border',
    icon: 'Info',
    iconColor: 'textSecondary'
  }
}

export const Toast = () => {
  const { toast, hideToast } = useToast()
  const insets = useSafeAreaInsets()

  const translateY = useSharedValue(-100)
  const opacity = useSharedValue(0)

  useEffect(() => {
    if (toast) {
      translateY.value = withTiming(0, { duration: 400, easing: Easing.out(Easing.exp) })
      opacity.value = withTiming(1, { duration: 300 })
    } else {
      translateY.value = withTiming(-100, { duration: 300, easing: Easing.in(Easing.exp) })
      opacity.value = withTiming(0, { duration: 200 })
    }
  }, [toast, translateY, opacity])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value
  }))

  if (!toast) return null

  const palette = PALETTE_BY_LEVEL[toast.level]

  const isAssertive = toast.level === 'error' || toast.level === 'warning'

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.wrapper, animatedStyle, { top: insets.top + 12 }]}
      accessibilityLiveRegion={isAssertive ? 'assertive' : 'polite'}
      accessibilityRole={isAssertive ? 'alert' : 'text'}
    >
      <Box
        flexDirection="row"
        alignItems="flex-start"
        gap={3}
        p={3}
        bg={palette.bg}
        style={[styles.card, { borderColor: theme.colors[palette.border] }]}
      >
        <Box
          h={6}
          w={6}
          alignItems="center"
          justifyContent="center"
          style={[styles.iconWrap, { borderColor: theme.colors[palette.iconColor] }]}
        >
          <ThemedIcon name={palette.icon} color={palette.iconColor} size={14} />
        </Box>

        <Box flex={1}>
          <ThemedText color="textPrimary" size="xs" weight="medium">
            {toast.message}
          </ThemedText>
        </Box>

        <Pressable
          onPress={hideToast}
          accessibilityRole="button"
          accessibilityLabel="Fechar notificação"
          hitSlop={HIT_SLOP}
          style={styles.dismiss}
        >
          <ThemedIcon name="X" color="textTerciary" size={16} />
        </Pressable>
      </Box>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    alignItems: 'center',
    zIndex: 99999
  },
  card: {
    minWidth: 280,
    maxWidth: 340,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 8
  },
  iconWrap: {
    borderRadius: 11,
    borderWidth: 1.5
  },
  dismiss: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

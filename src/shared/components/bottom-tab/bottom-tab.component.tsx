import React, { useEffect } from 'react'
import { Pressable, StyleSheet, TouchableOpacity } from 'react-native'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { theme } from '@src/shared/constants/theme'

import { Box } from '../box'
import { ThemedText } from '../themed-text'

type BottomTabProps = BottomTabBarProps

const ANIMATION_DURATION = 400

type TabItemProps = {
  label: string
  isFocused: boolean
  onPress: () => void
}

const TabItem: React.FC<TabItemProps> = ({ label, isFocused, onPress }) => {
  const AnimatedThemedText = Animated.createAnimatedComponent(ThemedText)
  const progress = useSharedValue(isFocused ? 1 : 0)

  useEffect(() => {
    progress.value = withTiming(isFocused ? 1 : 0, { duration: ANIMATION_DURATION })
  }, [isFocused, progress])

  const animatedTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], [theme.colors.textTerciary, theme.colors.textPrimary])
  }))

  return (
    <Pressable onPress={onPress} testID="tab-item" style={styles.pressable}>
      <AnimatedThemedText weight="medium" numberOfLines={1} ellipsizeMode="clip" style={animatedTextStyle}>
        {label}
      </AnimatedThemedText>
    </Pressable>
  )
}

export const BottomTab: React.FC<BottomTabProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets()

  return (
    <Box
      flexDirection="row"
      justifyContent="space-between"
      style={[
        styles.containerTabs,
        {
          paddingBottom: Math.max(insets.bottom - 4, 8),
          backgroundColor: theme.colors.background
        }
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]
        const label = options.tabBarLabel?.toString() ?? route.name
        const isFocused = state.index === index

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true
          })

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name)
          }
        }

        if (route.name === 'PostScreen') {
          return (
            <TouchableOpacity style={styles.centerButton} key={route.key} onPress={onPress}>
              <ThemedText size="sm" color="background" weight="medium" numberOfLines={1} ellipsizeMode="clip">
                postar
              </ThemedText>
            </TouchableOpacity>
          )
        }

        return <TabItem key={route.key} label={label} isFocused={isFocused} onPress={onPress} />
      })}
    </Box>
  )
}

const styles = StyleSheet.create({
  containerTabs: {
    paddingTop: 8,
    paddingLeft: 12,
    paddingRight: 12,
    borderTopWidth: 0.3,
    borderColor: theme.colors.textSecondary
  },
  pressable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16
  },
  centerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
    height: '80%',
    marginTop: 5
  }
})

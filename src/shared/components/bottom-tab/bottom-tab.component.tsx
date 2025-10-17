import React, { useEffect } from 'react'
import { Pressable, StyleSheet } from 'react-native'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { TabRoutesName } from '@src/app/navigation/types'
import { Box, ThemedIcon, ThemedText } from '@src/shared/components'
import { theme } from '@src/shared/constants/theme'

type BottomTabProps = BottomTabBarProps

const ANIMATION_DURATION = 400

const getWidthValue = (label: string) => {
  switch (label) {
    case TabRoutesName.HOME:
      return 48
    case TabRoutesName.SOCIAL:
      return 52
    case TabRoutesName.MENU:
      return 48
    default:
      return 60
  }
}

export const BottomTab: React.FC<BottomTabProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets()

  const handleIconName = (label: string) => {
    if (label === 'Home') return 'MapPin'
    if (label === 'Social') return 'MoonStar'
    return 'User'
  }

  return (
    <>
      <Box
        flexDirection="row"
        justifyContent="space-between"
        style={[
          styles.containerTabs,
          { paddingBottom: Math.max(insets.bottom - 4, 8), backgroundColor: theme.colors.background }
        ]}
      >
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key]
          const label = options.tabBarLabel
          const isFocused = state.index === index
          const iconName = handleIconName(options.tabBarLabel!.toString())

          const opacity = useSharedValue(isFocused ? 1 : 0)
          const textWidth = useSharedValue(isFocused ? getWidthValue(label) : 0)
          const gap = useSharedValue(isFocused ? 10 : 0)

          useEffect(() => {
            const widthValue = getWidthValue(label)
            opacity.value = withTiming(isFocused ? 1 : 0, { duration: ANIMATION_DURATION })
            textWidth.value = withTiming(isFocused ? widthValue : 0, { duration: ANIMATION_DURATION })
            gap.value = withTiming(isFocused ? 10 : 0, { duration: ANIMATION_DURATION })
          }, [isFocused, label, opacity, textWidth, gap])

          const animatedTextStyle = useAnimatedStyle(() => ({
            opacity: opacity.value,
            width: textWidth.value
          }))

          const animatedButtonStyle = useAnimatedStyle(() => ({
            backgroundColor: withTiming(
              isFocused ? theme.colors.backgroundSecondary : theme.colors.backgroundTertiary,
              {
                duration: ANIMATION_DURATION
              }
            )
          }))

          const spacerStyle = useAnimatedStyle(() => ({
            width: gap.value
          }))

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

          return (
            <Animated.View key={route.key} style={[styles.button, animatedButtonStyle]}>
              <Pressable onPress={onPress} testID="tab-item" style={styles.pressable}>
                <ThemedIcon
                  name={iconName}
                  size={20}
                  color="textPrimary"
                  type={isFocused ? 'solid' : 'light'}
                  testID="icon--tab-item"
                />
                <Animated.View style={[spacerStyle]} />
                <Animated.View style={animatedTextStyle}>
                  <ThemedText weight="bold" lineHeight={16} numberOfLines={1} ellipsizeMode="clip">
                    {label}
                  </ThemedText>
                </Animated.View>
              </Pressable>
            </Animated.View>
          )
        })}
      </Box>
    </>
  )
}

const styles = StyleSheet.create({
  containerTabs: {
    shadowColor: 'rgba(0, 0, 0, 0.8)',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 40,
    paddingTop: 12,
    paddingLeft: 24,
    paddingRight: 24,
    borderTopWidth: 0.3,
    borderColor: theme.colors.textSecondary
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16
  },
  pressable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16
  }
})

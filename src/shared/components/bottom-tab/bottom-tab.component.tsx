import React from 'react'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'

import { Box, Button, ThemedText } from '@src/shared/components'

type BottomTabProps = BottomTabBarProps

export const BottomTab: React.FC<BottomTabProps> = ({ state, descriptors, navigation }) => {
  return (
    <Box h={18} flexDirection="row" justifyContent="space-around" alignItems="center" bg="background">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]
        const label = options.tabBarLabel ?? options.title ?? route.name

        const focused = state.index === index
        const color = focused ? '#007AFF' : '#222'
        const position = 'below-icon'
        const isFocused = state.index === index

        let labelContent: React.ReactNode

        if (typeof label === 'function') {
          labelContent = label({
            focused,
            color,
            position,
            children: route.name
          })
        } else {
          labelContent = label
        }

        const handleNavigation = () => {
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
          <Box key={route.key} flex={1} alignItems="center" bg="background">
            <Button onPress={() => handleNavigation()} variant="ghost">
              <ThemedText>{labelContent}</ThemedText>
            </Button>
          </Box>
        )
      })}
    </Box>
  )
}

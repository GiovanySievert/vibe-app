import React from 'react'

import { Box, ThemedText } from '@src/shared/components'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'

type BottomTabProps = BottomTabBarProps

export const BottomTab: React.FC<BottomTabProps> = ({ state, descriptors, navigation }) => {
  return (
    <Box h={18} flexDirection="row" justifyContent="space-around" alignItems="center" bg="secondary">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]
        const label = options.tabBarLabel ?? options.title ?? route.name

        const focused = state.index === index
        const color = focused ? '#007AFF' : '#222'
        const position = 'below-icon'

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

        return (
          <Box key={route.key} flex={1} alignItems="center" bg="secondary">
            <ThemedText>{labelContent}</ThemedText>
          </Box>
        )
      })}
    </Box>
  )
}

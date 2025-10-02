import React from 'react'

import { icons } from 'lucide-react-native'

import { AppTheme, theme } from '@src/shared/constants/theme'

type IconName = keyof typeof icons

type ThemedIconProps = {
  name: IconName
  size?: number
  color?: keyof AppTheme['colors'] | string
  type?: 'light' | 'solid' | 'regular' | 'brands'
  testID?: string
}

export const ThemedIcon: React.FC<ThemedIconProps> = ({
  name,
  size = 20,
  color = 'gray.400',
  type = 'light',
  testID
}) => {
  const Icon = icons[name]

  const getTextColor = (color: keyof AppTheme['colors'] | string): string => {
    if (color.includes('.')) {
      const [colorKey, colorShade] = color.split('.')
      const shadeObject = theme.colors[colorKey as keyof typeof theme.colors]

      if (typeof shadeObject === 'object') {
        return shadeObject[colorShade as keyof typeof shadeObject]
      }
    } else if (color in theme.colors) {
      return theme.colors[color as keyof AppTheme['colors']]
    }

    return theme.colors.primary['500']
  }

  const iconColor = getTextColor(color)

  if (type === 'light') {
    return <Icon size={size} color={iconColor} testID={testID} />
  }
  if (type === 'solid') {
    return <Icon size={size} color={iconColor} testID={testID} />
  }
}

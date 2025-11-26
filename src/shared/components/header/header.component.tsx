import React from 'react'
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs'
import { getHeaderTitle } from '@react-navigation/elements'
import { SafeAreaView } from 'react-native-safe-area-context'

import { ArrowLeft } from 'lucide-react-native'

import { theme } from '@src/shared/constants/theme'

import { Box } from '../box'
import { Divider } from '../divider'
import { ThemedText } from '../themed-text'

type HeaderProps = BottomTabHeaderProps

export const Header: React.FC<HeaderProps> = ({ navigation, route, options }) => {
  const title = getHeaderTitle(options, route.name)

  return (
    <SafeAreaView
      edges={['left', 'right', 'top']}
      style={{
        backgroundColor: theme.colors.background
      }}
    >
      <Box flexDirection="row" gap={2} pr={4} pl={4} mb={4}>
        <ArrowLeft color={theme.colors.primary} />
        <ThemedText>{title}</ThemedText>
      </Box>
      <Divider />
    </SafeAreaView>
  )
}

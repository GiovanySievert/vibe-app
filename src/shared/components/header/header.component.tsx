import React from 'react'
import { getHeaderTitle } from '@react-navigation/elements'
import { ArrowLeft } from 'lucide-react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { ThemedText, Box, Divider } from '@src/shared/components'
import { theme } from '@src/shared/constants/theme'

import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs'

type HeaderProps = BottomTabHeaderProps

export const Header: React.FC<HeaderProps> = ({ navigation, route, options }) => {
  const title = getHeaderTitle(options, route.name)

  return (
    <SafeAreaView
      edges={['left', 'right', 'top']}
      style={{
        backgroundColor: theme.colors.secondary
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

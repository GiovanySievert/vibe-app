import React from 'react'
import { TouchableOpacity } from 'react-native'
import { getHeaderTitle } from '@react-navigation/elements'
import { NativeStackHeaderProps } from '@react-navigation/native-stack'
import { SafeAreaView } from 'react-native-safe-area-context'

import { theme } from '@src/shared/constants/theme'

import { Box } from '../box'
import { Divider } from '../divider'
import { ThemedIcon } from '../themed-icon'
import { ThemedText } from '../themed-text'

type HeaderProps = NativeStackHeaderProps

export const Header: React.FC<HeaderProps> = ({ navigation, route, options }) => {
  const title = getHeaderTitle(options, route.name)

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack()
    }
  }

  return (
    <SafeAreaView
      edges={['left', 'right', 'top']}
      style={{
        backgroundColor: theme.colors.background
      }}
    >
      <TouchableOpacity onPress={() => handleGoBack()}>
        <Box flexDirection="row" alignItems="center" gap={2} pr={4} pl={4} mb={4}>
          <ThemedIcon name="ArrowLeft" color="textPrimary" />
          <ThemedText color="textPrimary" weight="medium">
            {title}
          </ThemedText>
        </Box>
      </TouchableOpacity>
      <Divider />
    </SafeAreaView>
  )
}

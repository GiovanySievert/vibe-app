import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { theme } from '@src/shared/constants/theme'

type ScreenProps = {
  children: React.ReactNode
}

export const Screen: React.FC<ScreenProps> = ({ children }) => {
  return (
    <SafeAreaView style={style.container} edges={['right', 'left', 'top', 'bottom']}>
      <ScrollView>{children}</ScrollView>
    </SafeAreaView>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  }
})

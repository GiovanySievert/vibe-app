import React from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { theme } from '@src/shared/constants/theme'

export type ScreenProps = {
  children: React.ReactNode
}

export const Screen: React.FC<ScreenProps> = ({ children }) => {
  return (
    <SafeAreaView style={[styles.flex]} edges={['right', 'left', 'top', 'bottom']}>
      {children}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: theme.colors.background
  }
})

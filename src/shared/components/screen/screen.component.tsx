import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native'
import { theme } from '@src/shared/constants/theme'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type ScreenProps = {
  children: React.ReactNode
}

export const Screen: React.FC<ScreenProps> = ({ children }) => {
  return (
    <SafeAreaView style={style.container} edges={['right', 'left']}>
      {children}
    </SafeAreaView>
  )
}

const style = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.secondary
  }
})

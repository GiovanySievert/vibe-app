import React from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { LinearGradient } from 'expo-linear-gradient'

import { theme } from '@src/shared/constants/theme'

export type ScreenProps = {
  children: React.ReactNode
  gradient?: boolean
}

export const Screen: React.FC<ScreenProps> = ({ children, gradient }) => {
  if (gradient) {
    return (
      <SafeAreaView style={styles.flex} edges={['right', 'left', 'top', 'bottom']}>
        <LinearGradient
          colors={['#252525', 'transparent']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradientOverlay}
        />
        {children}
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.flex} edges={['right', 'left', 'top', 'bottom']}>
      {children}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  flexTransparent: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  gradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 160
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
})

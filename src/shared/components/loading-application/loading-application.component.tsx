import React from 'react'
import { StyleSheet, View } from 'react-native'

import { theme } from '@src/shared/constants/theme'

import { ThemedText } from '../themed-text'

interface LoadingApplicationProps {
  isVisible: boolean
}

export const LoadingApplication: React.FC<LoadingApplicationProps> = ({ isVisible }) => {
  if (!isVisible) return null

  return (
    <View style={styles.container}>
      <ThemedText color="primary" variant="title" style={styles.text}>
        vibes
      </ThemedText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    zIndex: 999
  },
  text: {
    fontSize: 52,
    fontWeight: '700',
    color: theme.colors.primary,
    lineHeight: 52
  }
})

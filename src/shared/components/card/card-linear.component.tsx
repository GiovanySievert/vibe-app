import React from 'react'
import { StyleSheet, View } from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'

import { Box } from '../box'
import { ThemedText } from '../themed-text'

type CardLinearProps = {
  title: string
  children: React.ReactNode
}

export const CardLinear: React.FC<CardLinearProps> = ({ title, children }) => {
  return (
    <LinearGradient
      colors={['rgba(93, 217, 193, 0.2)', 'transparent']}
      start={{ x: 1, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={styles.aboutCard}
    >
      {title && (
        <Box mb={1} flexDirection="row" alignItems="center" gap={2}>
          <View style={styles.indicator} />
          <ThemedText weight="semibold" size="lg">
            Sobre
          </ThemedText>
        </Box>
      )}
      {children}
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  aboutCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(93, 217, 193, 0.3)'
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8
  },
  indicator: {
    width: 4,
    height: 20,
    backgroundColor: '#5DD9C1',
    borderRadius: 999
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FAFAFA'
  },
  description: {
    fontSize: 16,
    color: '#B5B5B5',
    lineHeight: 24
  }
})

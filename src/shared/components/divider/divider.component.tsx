import React from 'react'
import { StyleSheet, View } from 'react-native'

import { theme } from '@src/shared/constants/theme'

export const Divider: React.FC = () => <View style={styles.divider} />

const styles = StyleSheet.create({
  divider: {
    height: 0.3,
    backgroundColor: theme.colors.textSecondary,
    width: '100%'
  }
})

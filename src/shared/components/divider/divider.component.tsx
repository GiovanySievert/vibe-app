import React from 'react'
import { View, StyleSheet } from 'react-native'

export const Divider: React.FC = () => <View style={styles.divider} />

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#CCC',
    width: '100%'
  }
})

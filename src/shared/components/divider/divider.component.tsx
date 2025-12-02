import React from 'react'
import { StyleSheet, View } from 'react-native'

export const Divider: React.FC = () => <View style={styles.divider} />

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#fff',
    width: '100%'
  }
})

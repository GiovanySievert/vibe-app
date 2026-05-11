import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { theme } from '@src/shared/constants/theme'

import { ThemedIcon } from '../themed-icon'

type GoBackButtonProps = {
  onPress?: () => void
}

export const GoBackButton: React.FC<GoBackButtonProps> = ({ onPress }) => {
  const navigation = useNavigation()

  return (
    <TouchableOpacity onPress={onPress ?? (() => navigation.goBack())} style={styles.button}>
      <ThemedIcon name="ArrowLeft" color="textPrimary" size={18} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderRadius: 999,
    borderColor: theme.colors.textSecondary,
    padding: 6
  }
})

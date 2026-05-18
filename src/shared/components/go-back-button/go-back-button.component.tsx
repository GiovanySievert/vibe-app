import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { theme } from '@src/shared/constants/theme'
import { HIT_SLOP } from '@src/shared/utils'

import { ThemedIcon } from '../themed-icon'

type GoBackButtonProps = {
  onPress?: () => void
  accessibilityLabel?: string
  accessibilityHint?: string
}

export const GoBackButton: React.FC<GoBackButtonProps> = ({
  onPress,
  accessibilityLabel = 'Voltar',
  accessibilityHint = 'Volta para a tela anterior'
}) => {
  const navigation = useNavigation()

  return (
    <TouchableOpacity
      onPress={onPress ?? (() => navigation.goBack())}
      style={styles.button}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      hitSlop={HIT_SLOP}
    >
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

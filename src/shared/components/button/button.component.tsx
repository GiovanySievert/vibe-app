import { theme } from '@src/shared/constants/theme'
import React from 'react'
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent, ViewStyle, TextStyle } from 'react-native'

interface ButtonProps {
  title: string
  onPress: (event: GestureResponderEvent) => void
  style?: ViewStyle
  textStyle?: TextStyle
  disabled?: boolean
}

export const Button: React.FC<ButtonProps> = ({ title, onPress, style, textStyle, disabled }) => (
  <TouchableOpacity
    style={[styles.button, style, disabled && styles.disabled]}
    onPress={onPress}
    activeOpacity={0.7}
    disabled={disabled}
  >
    <Text style={[styles.text, textStyle]}>{title}</Text>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    alignItems: 'center'
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  disabled: {
    backgroundColor: '#cccccc'
  }
})

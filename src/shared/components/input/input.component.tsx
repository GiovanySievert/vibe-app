import { theme } from '@src/shared/constants/theme'
import React from 'react'
import { TextInput, TextInputProps, StyleSheet, View } from 'react-native'

export interface InputProps extends TextInputProps {
  containerStyle?: object
}

export const Input: React.FC<InputProps> = ({ containerStyle, style, ...props }) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput style={[styles.input, style]} placeholderTextColor="#888" {...props} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    backgroundColor: theme.colors.secondary,
    fontSize: 16
  }
})

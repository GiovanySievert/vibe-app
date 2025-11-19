import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import { theme } from '@src/shared/constants/theme'

import { Box } from '../box'
import { ThemedText } from '../themed-text'

type RadioOption = {
  label: string
  value: string
}

type RadioButtonProps = {
  title?: string
  options: RadioOption[]
  selectedValue: string
  onValueChange: (value: string) => void
  testID?: string
}

export const RadioButton: React.FC<RadioButtonProps> = ({ title, options, selectedValue, onValueChange, testID }) => {
  return (
    <Box>
      {title && (
        <Box mb={4}>
          <ThemedText color="textPrimary" size="sm" weight="semibold">
            {title}
          </ThemedText>
        </Box>
      )}
      <View style={styles.container} testID={testID}>
        {options.map((option) => {
          const isSelected = selectedValue === option.value

          return (
            <View key={option.value} style={styles.optionContainer}>
              <TouchableOpacity
                onPress={() => onValueChange(option.value)}
                testID={`${option.value}--radio-button`}
                style={styles.touchable}
              >
                <View
                  style={[
                    styles.radioButton,
                    {
                      borderColor: isSelected ? theme.colors.primary : theme.colors.primaryGlow,
                      backgroundColor: isSelected ? theme.colors.primary : 'transparent'
                    }
                  ]}
                >
                  <View
                    style={[
                      styles.radioButtonInner,
                      {
                        backgroundColor: isSelected ? theme.colors.primary : 'transparent',
                        borderColor: isSelected ? theme.colors.textPrimary : 'transparent'
                      }
                    ]}
                    testID={`${option.value}--radio-button-inner`}
                  />
                </View>
                <ThemedText
                  color={isSelected ? 'textPrimary' : 'textSecondary'}
                  size="md"
                  weight={isSelected ? 'semibold' : 'medium'}
                >
                  {option.label}
                </ThemedText>
              </TouchableOpacity>
            </View>
          )
        })}
      </View>
    </Box>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent'
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  touchable: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5
  },
  radioButton: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  radioButtonInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    borderWidth: 1
  }
})

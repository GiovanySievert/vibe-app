import React from 'react'
import { TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { Box, Button, ThemedText } from '@src/shared/components'
import { Input } from '@src/shared/components/input'
import { Screen } from '@src/shared/components/screen'

export const AuthScreen = () => {
  const navigation = useNavigation()

  const handleNavigation = () => {
    navigation.navigate('SignInScreen')
  }

  return (
    <Screen>
      <Box p={4}>
        <Box mt={3}>
          <ThemedText>Welcome</ThemedText>
        </Box>
        <Box gap={4}>
          <Input label="E-mail" />
          <Input label="Password" />
          <Button title="Signin" onPress={() => {}} />
        </Box>

        <TouchableOpacity onPress={() => handleNavigation()}>
          <Box mt={4}>
            <ThemedText>don't have an account yet</ThemedText>
          </Box>
        </TouchableOpacity>
      </Box>
    </Screen>
  )
}

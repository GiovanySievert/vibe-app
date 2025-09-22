import { Box, Button, ThemedText } from '@src/shared/components'
import { Input } from '@src/shared/components/input'
import { Screen } from '@src/shared/components/screen'
import React from 'react'

export const AuthScreen = () => {
  return (
    <Screen>
      <Box mt={3}>
        <ThemedText>Welcome</ThemedText>
      </Box>
      <Box gap={4}>
        <Input />
        <Input />
        <Button title="Signin" onPress={() => {}} />
      </Box>

      <Box mt={4}>
        <ThemedText>don't have an account yet</ThemedText>
      </Box>
    </Screen>
  )
}

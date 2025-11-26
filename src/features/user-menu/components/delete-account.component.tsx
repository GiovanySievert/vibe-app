import { useState } from 'react'

import { useMutation } from '@tanstack/react-query'

import { authClient } from '@src/services/api/auth-client'
import { Box, Button, ThemedText } from '@src/shared/components'
import { Input } from '@src/shared/components'
import { useLogout } from '@src/shared/hooks'

import { deleteAccountSchema } from '../domain'

export const DeleteAccount = () => {
  const { logout } = useLogout()

  const [password, setPassword] = useState<string>('')
  const [passwordError, setPasswordError] = useState<string>('')

  const validateDeleteAccountSchema = () => {
    const result = deleteAccountSchema.safeParse({ password })
    if (!result.success) {
      setPasswordError(result.error.message)
      throw Error
    }
  }

  const submitForm = async () => {
    validateDeleteAccountSchema()

    const response = await authClient.deleteUser({
      password
    })
    return response
  }

  const { mutate: submitFormMutation, isPending: isLoading } = useMutation({
    mutationFn: async () => submitForm(),
    onSuccess: async () => {
      logout()
    },
    onError: (error) => {
      console.log('todo - add logger', error)
    }
  })

  return (
    <Box bg="background" gap={4}>
      <Input
        label="password"
        placeholder="Type here"
        value={password}
        onChange={({ nativeEvent }) => setPassword(nativeEvent.text)}
        errorMessage={passwordError}
        autoFocus
      />
      <Button type="danger" loading={isLoading} onPress={() => submitFormMutation()}>
        <ThemedText weight="medium">Deletar conta</ThemedText>
      </Button>
    </Box>
  )
}

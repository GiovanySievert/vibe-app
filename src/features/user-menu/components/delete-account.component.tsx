import { useState } from 'react'
import { Alert } from 'react-native'

import { Box, Button, ThemedText } from '@src/shared/components'
import { Input } from '@src/shared/components'
import { useDeleteAccount } from '@src/shared/hooks'

import { deleteAccountSchema } from '../domain'

export const DeleteAccount = () => {
  const { mutate: deleteAccount, isPending: isLoading } = useDeleteAccount()

  const [password, setPassword] = useState<string>('')
  const [passwordError, setPasswordError] = useState<string>('')

  const validateDeleteAccountSchema = () => {
    const result = deleteAccountSchema.safeParse({ password })
    if (!result.success) {
      setPasswordError(result.error.message)
      return false
    }
    setPasswordError('')
    return true
  }

  const handleDeletePress = () => {
    if (!validateDeleteAccountSchema()) return

    Alert.alert(
      'deletar conta',
      'tem certeza que deseja deletar sua conta? essa ação é permanente e não pode ser desfeita.',
      [
        { text: 'cancelar', style: 'cancel' },
        { text: 'deletar', style: 'destructive', onPress: () => deleteAccount({ password }) }
      ]
    )
  }

  return (
    <Box gap={5}>
      <ThemedText size="sm" color="textSecondary">
        ao deletar sua conta, todos os seus dados, posts e interações serão removidos permanentemente. confirme sua
        senha para continuar.
      </ThemedText>

      <Input
        label="senha"
        value={password}
        onChange={({ nativeEvent }) => setPassword(nativeEvent.text)}
        errorMessage={passwordError}
        autoFocus
        secureTextEntry
      />

      <Button type="danger" loading={isLoading} onPress={handleDeletePress}>
        <ThemedText weight="medium">deletar conta</ThemedText>
      </Button>
    </Box>
  )
}

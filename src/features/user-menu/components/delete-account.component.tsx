import { useState } from 'react'
import { Alert } from 'react-native'

import { Box, Button, ThemedText } from '@src/shared/components'
import { Input } from '@src/shared/components'
import { useDeleteAccount } from '@src/shared/hooks'
import { useAppTranslation } from '@src/shared/i18n'

import { deleteAccountSchema } from '../domain'

export const DeleteAccount = () => {
  const [password, setPassword] = useState<string>('')
  const [passwordError, setPasswordError] = useState<string>('')
  const { t } = useAppTranslation()

  const { mutate: deleteAccount, isPending: isLoading } = useDeleteAccount({
    onError: (error) => setPasswordError(error.message)
  })

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

    Alert.alert(t('userMenu.deleteAccount.alertTitle'), t('userMenu.deleteAccount.alertMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('userMenu.deleteAccount.confirmDelete'),
        style: 'destructive',
        onPress: () => deleteAccount({ password })
      }
    ])
  }

  return (
    <Box gap={5}>
      <ThemedText size="sm" color="textSecondary">
        {t('userMenu.deleteAccount.warning')}
      </ThemedText>

      <Input
        label={t('userMenu.deleteAccount.passwordLabel')}
        value={password}
        onChange={({ nativeEvent }) => setPassword(nativeEvent.text)}
        errorMessage={passwordError}
        autoFocus
        secureTextEntry
      />

      <Button type="danger" loading={isLoading} onPress={handleDeletePress}>
        <ThemedText weight="medium">{t('userMenu.deleteAccount.buttonLabel')}</ThemedText>
      </Button>
    </Box>
  )
}

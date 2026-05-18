import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAtom } from 'jotai'

import { useToast } from '@src/app/providers/toast.provider'
import { UsernameField } from '@src/features/auth/components'
import { buildSignUpProfileSchema } from '@src/features/auth/domain'
import { AuthService } from '@src/features/auth/services'
import { authStateAtom } from '@src/features/auth/state'
import { Box, Button, GoBackButton, ThemedText } from '@src/shared/components'
import { Screen } from '@src/shared/components/screen'
import { theme } from '@src/shared/constants/theme'
import { useDebounce } from '@src/shared/hooks'
import { useAppTranslation } from '@src/shared/i18n'

const CHECK_DEBOUNCE_MS = 2000

const buildUsernameSchema = () => buildSignUpProfileSchema().pick({ username: true })

export const ChangeUsernameScreen = () => {
  const navigation = useNavigation()
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const [authState, setAuthState] = useAtom(authStateAtom)
  const { t } = useAppTranslation()

  const currentUsername = authState.user.username
  const [username, setUsername] = useState(currentUsername)
  const [available, setAvailable] = useState<boolean | null>(null)
  const [error, setError] = useState<string>('')

  const handleChange = (value: string) => {
    setError('')
    setAvailable(null)
    setUsername(value)
  }

  const { mutate: checkUsername, isPending: isChecking } = useMutation({
    mutationFn: (value: string) => AuthService.checkIfUsernameIsAvailable(value),
    onSuccess: ({ data }) => {
      if (!data.available) {
        setError(t('userMenu.changeUsername.unavailable'))
        setAvailable(false)
        return
      }
      setError('')
      setAvailable(true)
    },
    onError: () => {
      setError(t('userMenu.changeUsername.checkError'))
      setAvailable(null)
    }
  })

  const debouncedUsername = useDebounce(username, CHECK_DEBOUNCE_MS)

  useEffect(() => {
    const trimmed = debouncedUsername.trim()
    if (trimmed.length === 0 || trimmed === currentUsername) return

    const result = buildUsernameSchema().safeParse({ username: trimmed })
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? t('userMenu.changeUsername.invalid'))
      setAvailable(false)
      return
    }
    checkUsername(trimmed)
  }, [debouncedUsername, currentUsername, checkUsername, t])

  const { mutate: submitUpdate, isPending: isSaving } = useMutation({
    mutationFn: (value: string) => AuthService.updateUsername(value),
    onSuccess: ({ data }) => {
      setAuthState((prev) => ({
        ...prev,
        user: { ...prev.user, username: data.username }
      }))
      queryClient.invalidateQueries({
        queryKey: ['fetchUserById', authState.user.id]
      })
      showToast(t('userMenu.changeUsername.successToast'))
      navigation.goBack()
    },
    onError: (mutationError) => {
      const status = (mutationError as { status?: number; response?: { status?: number } })?.response?.status
      if (status === 409) {
        setError(t('userMenu.changeUsername.inUse'))
        setAvailable(false)
        return
      }
      showToast(t('userMenu.changeUsername.updateError'), 'error')
    }
  })

  const handleSave = () => {
    const trimmed = username.trim()
    const result = buildUsernameSchema().safeParse({ username: trimmed })
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? t('userMenu.changeUsername.invalid'))
      return
    }
    submitUpdate(trimmed)
  }

  const isUnchanged = username.trim() === currentUsername
  const isDisabled = isUnchanged || available !== true || isSaving || isChecking

  return (
    <ScrollView style={styles.scroll}>
      <Screen>
        <Box pr={5} pl={5} mt={5} mb={5} flexDirection="row" alignItems="center" gap={3}>
          <GoBackButton />
          <Box>
            <ThemedText variant="title">{t('userMenu.changeUsername.title')}</ThemedText>
            <ThemedText variant="mono">{t('userMenu.changeUsername.subtitle')}</ThemedText>
          </Box>
        </Box>

        <Box gap={6} pl={6} pr={6} pb={6}>
          <UsernameField
            value={username}
            onChangeText={handleChange}
            available={available}
            errorMessage={error}
            autoFocus
          />

          <Button disabled={isDisabled} loading={isSaving} onPress={handleSave}>
            <ThemedText color="background" weight="semibold" size="lg">
              {t('common.save')}
            </ThemedText>
          </Button>
        </Box>
      </Screen>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: theme.colors.background }
})

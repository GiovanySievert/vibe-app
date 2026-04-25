import React from 'react'

import { Box, Button, ThemedText } from '@src/shared/components'
import { Input } from '@src/shared/components'

import { SignUpProfileForm } from '../domain'

type AuthProfileStepProps = {
  form: SignUpProfileForm
  formError: SignUpProfileForm
  usernameAvailable: boolean | null
  onChangeForm: (key: keyof SignUpProfileForm, value: string) => void
  onUsernameBlur: () => void
  onContinue: () => void
  isLoading: boolean
}

export const AuthProfileStep: React.FC<AuthProfileStepProps> = ({
  form,
  formError,
  usernameAvailable,
  onChangeForm,
  onUsernameBlur,
  onContinue,
  isLoading
}) => {
  return (
    <Box gap={6}>
      <Box gap={1}>
        <ThemedText variant="title">como te chamam?</ThemedText>
        <ThemedText variant="secondary">é assim que seus amigos vão te encontrar.</ThemedText>
      </Box>

      <Box gap={4}>
        <Input
          label="nome"
          value={form.name}
          onChange={({ nativeEvent }) => onChangeForm('name', nativeEvent.text)}
          errorMessage={formError.name}
          autoFocus
        />

        <Box gap={2}>
          <Input
            label="usuário"
            value={form.username}
            onChange={({ nativeEvent }) => onChangeForm('username', nativeEvent.text)}
            errorMessage={formError.username}
            autoCapitalize="none"
            onBlur={onUsernameBlur}
            endIconName={usernameAvailable === true ? 'Check' : undefined}
            maxLength={20}
          />
          {usernameAvailable === true && (
            <ThemedText variant="mono" size="sm" color="textSecondary">
              vibes.app/{form.username} · disponível
            </ThemedText>
          )}
        </Box>
      </Box>

      <Box mt={4}>
        <Button loading={isLoading} onPress={onContinue}>
          <ThemedText color="background" weight="semibold">
            continuar
          </ThemedText>
        </Button>
      </Box>
    </Box>
  )
}

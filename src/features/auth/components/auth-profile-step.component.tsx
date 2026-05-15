import React, { useEffect, useRef } from 'react'
import { TextInput } from 'react-native'

import { Box, Button, ThemedText } from '@src/shared/components'
import { Input } from '@src/shared/components'

import { SignUpProfileForm } from '../domain'
import { UsernameField } from './username-field'

type AuthProfileStepProps = {
  form: SignUpProfileForm
  formError: SignUpProfileForm
  usernameAvailable: boolean | null
  onChangeForm: (key: keyof SignUpProfileForm, value: string) => void
  onUsernameBlur: () => void
  onContinue: () => void
  onAppleSignIn?: () => void
  showAppleButton?: boolean
  appleLoading?: boolean
  onGoogleSignIn?: () => void
  showGoogleButton?: boolean
  googleLoading?: boolean
  isLoading: boolean
  isActive: boolean
}

export const AuthProfileStep: React.FC<AuthProfileStepProps> = ({
  form,
  formError,
  usernameAvailable,
  onChangeForm,
  onUsernameBlur,
  onContinue,
  onAppleSignIn,
  showAppleButton,
  appleLoading,
  onGoogleSignIn,
  showGoogleButton,
  googleLoading,
  isLoading,
  isActive
}) => {
  const nameInputRef = useRef<TextInput>(null)

  useEffect(() => {
    if (!isActive) return

    const timeoutId = setTimeout(() => {
      nameInputRef.current?.focus()
    }, 350)

    return () => clearTimeout(timeoutId)
  }, [isActive])

  return (
    <Box gap={6}>
      <Box gap={1}>
        <ThemedText variant="title">como te chamam?</ThemedText>
        <ThemedText variant="secondary">é assim que seus amigos vão te encontrar.</ThemedText>
      </Box>

      <Box gap={4}>
        <Input
          ref={nameInputRef}
          label="nome"
          value={form.name}
          onChange={({ nativeEvent }) => onChangeForm('name', nativeEvent.text)}
          errorMessage={formError.name}
          keyboardType="default"
          autoCapitalize="words"
          autoComplete="name"
          textContentType="name"
        />

        <UsernameField
          value={form.username}
          onChangeText={(text) => onChangeForm('username', text)}
          onBlur={onUsernameBlur}
          available={usernameAvailable}
          errorMessage={formError.username}
        />
      </Box>

      <Box mt={4} gap={3}>
        <Button loading={isLoading} onPress={onContinue}>
          <ThemedText color="background" size="lg" weight="semibold">
            continuar
          </ThemedText>
        </Button>

        {showAppleButton && onAppleSignIn && (
          <Button variant="outline" onPress={onAppleSignIn} loading={appleLoading}>
            <ThemedText color="textPrimary" size="lg" weight="semibold">
              cadastrar com apple
            </ThemedText>
          </Button>
        )}

        {showGoogleButton && onGoogleSignIn && (
          <Button variant="outline" onPress={onGoogleSignIn} loading={googleLoading}>
            <ThemedText color="textPrimary" size="lg" weight="semibold">
              cadastrar com google
            </ThemedText>
          </Button>
        )}
      </Box>
    </Box>
  )
}

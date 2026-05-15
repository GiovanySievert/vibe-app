import React, { useEffect, useRef } from 'react'
import { TextInput } from 'react-native'

import { AnimatedBox, Box, Button, Input, PasswordInput, ThemedText } from '@src/shared/components'

import { SignUpEmailForm } from '../domain'

type AuthEmailStepProps = {
  form: SignUpEmailForm
  formError: SignUpEmailForm
  onChangeForm: (key: keyof SignUpEmailForm, value: string) => void
  onContinue: () => void
  isLoading?: boolean
  isActive: boolean
}

export const AuthEmailStep: React.FC<AuthEmailStepProps> = ({
  form,
  formError,
  onChangeForm,
  onContinue,
  isLoading,
  isActive
}) => {
  const emailInputRef = useRef<TextInput>(null)

  useEffect(() => {
    if (!isActive) return

    const timeoutId = setTimeout(() => {
      emailInputRef.current?.focus()
    }, 350)

    return () => clearTimeout(timeoutId)
  }, [isActive])

  return (
    <Box gap={6}>
      <Box gap={1} mb={6}>
        <ThemedText variant="title">criar conta</ThemedText>
        <ThemedText variant="secondary">precisa só do básico pra começar.</ThemedText>
      </Box>

      <Box gap={6}>
        <Box gap={2}>
          <Input
            ref={emailInputRef}
            label="email"
            value={form.email}
            onChange={({ nativeEvent }) => onChangeForm('email', nativeEvent.text)}
            errorMessage={formError.email}
            keyboardType="email-address"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            textContentType="emailAddress"
          />
          <AnimatedBox isVisible={form.email.length > 10}>
            <ThemedText variant="mono" size="sm" color="textSecondary">
              iremos validar seu email, confirme se está correto.
            </ThemedText>
          </AnimatedBox>
        </Box>

        <PasswordInput
          value={form.password}
          onChange={(value) => onChangeForm('password', value)}
          errorMessage={formError.password}
          keyboardType="default"
          autoComplete="off"
          textContentType="none"
        />
      </Box>

      <Box mt={4} gap={4}>
        <Button loading={isLoading} onPress={onContinue}>
          <ThemedText color="background" size="lg" weight="semibold">
            continuar
          </ThemedText>
        </Button>

        <Box justifyContent="center" flexDirection="row" alignItems="center">
          <ThemedText variant="mono" color="textSecondary">
            ao continuar você aceita os{' '}
          </ThemedText>
          <ThemedText variant="mono" weight="semibold" textDecorationLine="underline">
            termos
          </ThemedText>
          <ThemedText variant="mono" color="textSecondary">
            {' '}
            e a{' '}
          </ThemedText>
          <ThemedText variant="mono" weight="semibold" textDecorationLine="underline">
            privacidade
          </ThemedText>
        </Box>
      </Box>
    </Box>
  )
}

import React, { useEffect, useRef, useState } from 'react'
import { TextInput } from 'react-native'

import { useMutation } from '@tanstack/react-query'

import { authClient } from '@src/services/api/auth-client'
import { Box, Button, ThemedText } from '@src/shared/components'
import { Input } from '@src/shared/components'
import { useAppTranslation } from '@src/shared/i18n'
import { validationMapErrors } from '@src/shared/utils'

import { buildForgotPasswordEmailStepSchema, ForgotPasswordEmailStepForm } from '../../domain'

type ForgotPasswordEmailStepProps = {
  typedEmail?: string
  setTypedEmailFromEmailStep: (email: string) => void
  goToCodeStep: () => void
  isActive: boolean
}

const EMPTY_ERRORS: ForgotPasswordEmailStepForm = { email: '' }

export const ForgotPasswordEmailStep: React.FC<ForgotPasswordEmailStepProps> = ({
  typedEmail,
  setTypedEmailFromEmailStep,
  goToCodeStep,
  isActive
}) => {
  const emailInputRef = useRef<TextInput>(null)
  const [email, setEmail] = useState<string>(typedEmail ?? '')
  const [formError, setFormError] = useState<ForgotPasswordEmailStepForm>(EMPTY_ERRORS)
  const { t } = useAppTranslation()

  useEffect(() => {
    if (!isActive) return

    const timeoutId = setTimeout(() => {
      emailInputRef.current?.focus()
    }, 350)

    return () => clearTimeout(timeoutId)
  }, [isActive])

  const validateEmailSchema = (): boolean => {
    const result = buildForgotPasswordEmailStepSchema().safeParse({ email })

    if (!result.success) {
      setFormError(validationMapErrors(result.error, EMPTY_ERRORS))
      return false
    }

    setFormError(EMPTY_ERRORS)
    return true
  }

  const submitForm = async () => {
    if (!validateEmailSchema()) throw new Error('validation')
    const response = await authClient.forgetPassword.emailOtp({ email })
    return response
  }

  const { mutate: submitFormMutation, isPending: isLoading } = useMutation({
    mutationFn: async () => submitForm(),
    onSuccess: async () => {
      goToCodeStep()
      setTypedEmailFromEmailStep(email)
    },
    onError: (error: Error) => {
      if (error.message === 'validation') return
      goToCodeStep()
      setTypedEmailFromEmailStep(email)
    }
  })

  return (
    <>
      <Box mb={4}>
        <ThemedText variant="title" size="4xl" color="textPrimary">
          {t('auth.forgotPassword.title')}
        </ThemedText>
        <ThemedText variant="primary" color="textSecondary">
          {t('auth.forgotPassword.subtitle')}
        </ThemedText>
      </Box>
      <Box gap={6}>
        <Input
          ref={emailInputRef}
          label={t('auth.forgotPassword.emailLabel')}
          value={email}
          onChange={({ nativeEvent }) => setEmail(nativeEvent.text)}
          errorMessage={formError.email}
          keyboardType="email-address"
          inputMode="email"
          autoComplete="email"
          textContentType="emailAddress"
          autoCapitalize="none"
        />
        <Button loading={isLoading} onPress={() => submitFormMutation()}>
          <ThemedText color="background" size="lg" weight="semibold">
            {t('auth.forgotPassword.submitButton')}
          </ThemedText>
        </Button>
      </Box>
    </>
  )
}

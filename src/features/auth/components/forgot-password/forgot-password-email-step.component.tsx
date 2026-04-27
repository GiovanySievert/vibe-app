import React, { useState } from 'react'

import { useMutation } from '@tanstack/react-query'

import { authClient } from '@src/services/api/auth-client'
import { Box, Button, ThemedText } from '@src/shared/components'
import { Input } from '@src/shared/components'
import { validationMapErrors } from '@src/shared/utils'

import { ForgotPasswordEmailStepForm, forgotPasswordEmailStepSchema } from '../../domain'

type ForgotPasswordEmailStepProps = {
  typedEmail?: string
  setTypedEmailFromEmailStep: (email: string) => void
  goToCodeStep: () => void
}

const EMPTY_ERRORS: ForgotPasswordEmailStepForm = { email: '' }

export const ForgotPasswordEmailStep: React.FC<ForgotPasswordEmailStepProps> = ({
  typedEmail,
  setTypedEmailFromEmailStep,
  goToCodeStep
}) => {
  const [email, setEmail] = useState<string>(typedEmail ?? '')
  const [formError, setFormError] = useState<ForgotPasswordEmailStepForm>(EMPTY_ERRORS)

  const validateEmailSchema = (): boolean => {
    const result = forgotPasswordEmailStepSchema.safeParse({ email })

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
          esqueceu a senha?
        </ThemedText>
        <ThemedText variant="primary" color="textSecondary">
          digite o email cadastrado que enviaremos um codigo.
        </ThemedText>
      </Box>
      <Box gap={6}>
        <Input
          label="email"
          value={email}
          onChange={({ nativeEvent }) => setEmail(nativeEvent.text)}
          errorMessage={formError.email}
          autoFocus
        />
        <Button loading={isLoading} onPress={() => submitFormMutation()}>
          <ThemedText color="background" size="lg" weight="semibold">
            continuar
          </ThemedText>
        </Button>
      </Box>
    </>
  )
}

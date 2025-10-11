import React, { useState } from 'react'

import { useMutation } from '@tanstack/react-query'

import { authClient } from '@src/services/api/auth-client'
import { Box, Button, ThemedText } from '@src/shared/components'
import { Card } from '@src/shared/components/card/card.component'
import { Input } from '@src/shared/components/input'

import { forgotPasswordEmailStepSchema } from '../../domain'

type ForgotPasswordEmailStepProps = {
  typedEmail?: string
  setTypedEmailFromEmailStep: (email: string) => void
  goToCodeStep: () => void
}

export const ForgotPasswordEmailStep: React.FC<ForgotPasswordEmailStepProps> = ({
  typedEmail,
  setTypedEmailFromEmailStep,
  goToCodeStep
}) => {
  const [email, setEmail] = useState<string>(typedEmail ? typedEmail : '')
  const [emailError, setEmailError] = useState<string>('')

  const validateEmailSchema = async () => {
    const result = forgotPasswordEmailStepSchema.safeParse({
      email
    })

    if (!result.success) {
      setEmailError(result.error.message)
      throw Error
    }
  }

  const submitForm = async () => {
    validateEmailSchema()
    const response = await authClient.forgetPassword.emailOtp({ email })
    return response
  }

  const { mutate: submitFormMutation, isPending: isLoading } = useMutation({
    mutationFn: async () => submitForm(),
    onSuccess: async () => {
      goToCodeStep()
      setTypedEmailFromEmailStep(email)
    },
    onError: (error) => {
      console.error('todo - add logger', error)
    }
  })

  return (
    <Card pt={6} pb={6} pl={6} pr={6}>
      <Box mt={3} mb={3}>
        <ThemedText>Forgot password?</ThemedText>
      </Box>
      <Box gap={6}>
        <Input
          label="Email"
          placeholder="Type here"
          value={email}
          onChange={({ nativeEvent }) => setEmail(nativeEvent.text)}
          errorMessage={emailError}
          autoFocus
        />
        <Button loading={isLoading} onPress={() => submitFormMutation()}>
          <ThemedText>Send code</ThemedText>
        </Button>
      </Box>
    </Card>
  )
}

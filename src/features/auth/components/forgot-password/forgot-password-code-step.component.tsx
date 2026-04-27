import React, { useState } from 'react'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { useMutation } from '@tanstack/react-query'

import { UnathenticatedStackParamList } from '@src/app/navigation/types'
import { useToast } from '@src/app/providers'
import { authClient } from '@src/services/api/auth-client'
import { Box, Button, Input, PasswordInput, ThemedText } from '@src/shared/components'
import { validationMapErrors } from '@src/shared/utils'

import { forgotPasswordCodeStepSchema, UserResetPasswordRequestDTO } from '../../domain'

type ForgotPasswordCodeStepProps = {
  typedEmail: string
}

export const ForgotPasswordCodeStep: React.FC<ForgotPasswordCodeStepProps> = ({ typedEmail }) => {
  const navigation = useNavigation<NavigationProp<UnathenticatedStackParamList>>()

  const { showToast } = useToast()

  const [form, setForm] = useState<UserResetPasswordRequestDTO>({
    code: '',
    password: '',
    email: typedEmail
  })

  const [formError, setFormError] = useState<UserResetPasswordRequestDTO>({
    code: '',
    password: '',
    email: ''
  })

  const handleChangeInputValue = (key: string, value: string) => {
    setForm((prevState) => ({
      ...prevState,
      [key]: value
    }))
  }

  const validateForgotPasswordSchema = () => {
    const values = {
      code: form.code,
      password: form.password,
      email: form.email
    }

    const result = forgotPasswordCodeStepSchema.safeParse(values)
    if (!result.success) {
      setFormError(validationMapErrors(result.error, formError))
      throw Error
    }
  }

  const handleSubmitForgotPasswordError = (error: any) => {
    if (error.code === 'INVALID_OTP') {
      showToast('código inválido')
      throw Error
    }

    showToast('algo deu errado, tente novamente mais tarde')
    throw Error
  }

  const submitForm = async () => {
    setFormError({
      code: '',
      email: '',
      password: ''
    })
    validateForgotPasswordSchema()

    const { data, error } = await authClient.emailOtp.resetPassword({
      email: form.email,
      otp: form.code,
      password: form.password
    })
    if (error) {
      handleSubmitForgotPasswordError(error)
    }

    return data
  }

  const { mutate: submitFormMutation, isPending: isLoading } = useMutation({
    mutationFn: async () => submitForm(),
    onSuccess: async (data) => {
      if (data) navigation.navigate('AuthScreen')
    },
    onError: (error) => {
      console.error('todo - add logger', error)
    }
  })

  return (
    <Box mb={4}>
      <ThemedText variant="title" size="4xl" color="textPrimary">
        esqueceu a senha?
      </ThemedText>
      <ThemedText variant="primary" color="textSecondary">
        digite o código que enviamos no seu email, se nāo recebeu nada, tente se cadastrar.
      </ThemedText>

      <Box mt={4} gap={6}>
        <Input
          label="código"
          value={form.code}
          onChange={({ nativeEvent }) => handleChangeInputValue('code', nativeEvent.text)}
          errorMessage={formError.code}
          autoFocus
        />

        <PasswordInput
          label="nova senha"
          value={form.password}
          onChange={(value) => handleChangeInputValue('password', value)}
          errorMessage={formError.password}
        />
        <Button loading={isLoading} onPress={() => submitFormMutation()}>
          <ThemedText color="background" size="lg" weight="semibold">
            continuar
          </ThemedText>
        </Button>
      </Box>
    </Box>
  )
}

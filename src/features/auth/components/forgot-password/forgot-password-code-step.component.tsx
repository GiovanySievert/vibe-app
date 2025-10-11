import React, { useState } from 'react'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { useMutation } from '@tanstack/react-query'

import { UnathenticatedStackParamList } from '@src/app/navigation/types'
import { useToast } from '@src/app/providers'
import { authClient } from '@src/services/api/auth-client'
import { Box, Button, ThemedText } from '@src/shared/components'
import { Card } from '@src/shared/components/card/card.component'
import { Input } from '@src/shared/components/input'
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
      showToast('Codigo invalido')
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
    <Card pt={6} pb={6} pl={6} pr={6}>
      <Box mt={3} mb={3}>
        <ThemedText>Forgot password?</ThemedText>
      </Box>
      <Box gap={6}>
        <Input
          label="code"
          placeholder="Type here"
          value={form.code}
          onChange={({ nativeEvent }) => handleChangeInputValue('code', nativeEvent.text)}
          errorMessage={formError.code}
          autoFocus
        />

        <Input
          label="password"
          placeholder="Type here"
          value={form.password}
          onChange={({ nativeEvent }) => handleChangeInputValue('password', nativeEvent.text)}
          errorMessage={formError.password}
        />
        <Button loading={isLoading} onPress={() => submitFormMutation()}>
          <ThemedText>Send code</ThemedText>
        </Button>
      </Box>
    </Card>
  )
}

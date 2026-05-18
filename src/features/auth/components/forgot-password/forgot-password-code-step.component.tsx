import React, { useState } from 'react'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { useMutation } from '@tanstack/react-query'

import { UnathenticatedStackParamList } from '@src/app/navigation/types'
import { useToast } from '@src/app/providers/toast.provider'
import { authClient } from '@src/services/api/auth-client'
import { Box, Button, Input, PasswordInput, ThemedText } from '@src/shared/components'
import { useAppTranslation } from '@src/shared/i18n'
import { validationMapErrors } from '@src/shared/utils'

import { buildForgotPasswordCodeStepSchema, UserResetPasswordRequestDTO } from '../../domain'

type ForgotPasswordCodeStepProps = {
  typedEmail: string
  isActive: boolean
}

export const ForgotPasswordCodeStep: React.FC<ForgotPasswordCodeStepProps> = ({ typedEmail, isActive }) => {
  const navigation = useNavigation<NavigationProp<UnathenticatedStackParamList>>()

  const { showToast } = useToast()
  const { t } = useAppTranslation()

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

    const result = buildForgotPasswordCodeStepSchema().safeParse(values)
    if (!result.success) {
      setFormError(validationMapErrors(result.error, formError))
      throw Error
    }
  }

  const handleSubmitForgotPasswordError = (error: any) => {
    if (error.code === 'INVALID_OTP') {
      showToast(t('auth.errors.invalidOtp'), 'error')
      throw Error
    }

    showToast(t('auth.errors.generic'), 'error')
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
    }
  })

  return (
    <Box mb={4}>
      <ThemedText variant="title" size="4xl" color="textPrimary">
        {t('auth.forgotPassword.codeStep.title')}
      </ThemedText>
      <ThemedText variant="primary" color="textSecondary">
        {t('auth.forgotPassword.codeStep.subtitle')}
      </ThemedText>

      <Box mt={4} gap={6}>
        <Input
          label={t('auth.forgotPassword.codeLabel')}
          value={form.code}
          onChange={({ nativeEvent }) => handleChangeInputValue('code', nativeEvent.text)}
          errorMessage={formError.code}
          autoFocus={isActive}
          keyboardType="number-pad"
          inputMode="numeric"
          autoComplete="one-time-code"
          textContentType="oneTimeCode"
        />

        <PasswordInput
          label={t('auth.forgotPassword.newPasswordLabel')}
          value={form.password}
          onChange={(value) => handleChangeInputValue('password', value)}
          errorMessage={formError.password}
          keyboardType="default"
          autoComplete="off"
          textContentType="none"
        />
        <Button loading={isLoading} onPress={() => submitFormMutation()}>
          <ThemedText color="background" size="lg" weight="semibold">
            {t('auth.forgotPassword.submitButton')}
          </ThemedText>
        </Button>
      </Box>
    </Box>
  )
}

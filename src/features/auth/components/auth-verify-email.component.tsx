import React, { useEffect, useState } from 'react'

import { useMutation } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'

import { useToast } from '@src/app/providers'
import { authClient } from '@src/services/api/auth-client'
import { Box, Button, ThemedText } from '@src/shared/components'
import { Input } from '@src/shared/components/input'
import { validationMapErrors } from '@src/shared/utils'

import { otpSchema, SendVerificationEmailForm } from '../domain'
import { authStateAtom } from '../state'

type AuthVerifyEmailProps = {
  emailToBeVerified: string
}

export const AuthVerifyEmail: React.FC<AuthVerifyEmailProps> = ({ emailToBeVerified }) => {
  const setAuthState = useSetAtom(authStateAtom)
  const { showToast } = useToast()

  const [isResendDisabled, setIsResendDisabled] = useState(true)
  const [countdown, setCountdown] = useState(30)
  const [form, setForm] = useState<SendVerificationEmailForm>({
    otp: ''
  })

  const [formError, setFormError] = useState<SendVerificationEmailForm>({
    otp: ''
  })

  const handleChangeInputValue = (key: string, value: string) => {
    setForm((prevState) => ({
      ...prevState,
      [key]: value
    }))
  }

  const validateVerifyEmailSchema = () => {
    setFormError({
      otp: ''
    })
    const values = {
      otp: form.otp
    }

    const result = otpSchema.safeParse(values)
    if (!result.success) {
      setFormError(validationMapErrors(result.error, formError))
      throw Error
    }
  }

  const handleVerifyEmailError = (error: any) => {
    if (error.code === 'INVALID_OTP') {
      showToast('Codigo invalido')
      return
    }
    showToast('Algo deu errado, tente novamente mais tarde.')
    return
  }

  const submitForm = async () => {
    validateVerifyEmailSchema()

    const { data, error } = await authClient.emailOtp.verifyEmail({
      otp: form.otp,
      email: emailToBeVerified
    })

    if (error) {
      handleVerifyEmailError(error)
    }

    return data
  }

  const { mutate: submitFormMutation, isPending: isLoading } = useMutation({
    mutationFn: async () => submitForm(),
    onSuccess: async (data) => {
      if (data)
        setAuthState({
          isAuthenticated: true,
          user: data.user
        })
    },
    onError: (error) => {
      console.error('todo - add logger', error)
    }
  })

  const handleSendVerificationEmail = async () => {
    try {
      await authClient.emailOtp.sendVerificationOtp({
        email: emailToBeVerified,
        type: 'email-verification'
      })

      setIsResendDisabled(true)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    handleSendVerificationEmail()
  }, [])

  useEffect(() => {
    if (!isResendDisabled) {
      return
    }

    const intervalId = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(intervalId)
          setIsResendDisabled(false)
          return 30
        }
        return prevCountdown - 1
      })
    }, 1000)

    return () => clearInterval(intervalId)
  }, [isResendDisabled])

  return (
    <Box p={4}>
      <Box mt={3}>
        <ThemedText>SignIn</ThemedText>
      </Box>
      <Box gap={2}>
        <Input
          label="Codigo"
          placeholder="Type here"
          value={form.otp}
          onChange={({ nativeEvent }) => handleChangeInputValue('otp', nativeEvent.text)}
          errorMessage={formError.otp}
          autoFocus
        />
        <Button loading={isLoading} onPress={() => submitFormMutation()}>
          <ThemedText>verificar email</ThemedText>
        </Button>
        <Button variant="ghost" disabled={isResendDisabled} onPress={() => handleSendVerificationEmail()}>
          <ThemedText>{isResendDisabled ? `Reenviar em ${countdown}s` : 'Reenviar código'}</ThemedText>
        </Button>
      </Box>
    </Box>
  )
}

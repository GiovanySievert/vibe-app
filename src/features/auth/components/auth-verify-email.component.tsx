import React, { useCallback, useEffect, useRef, useState } from 'react'

import { useMutation } from '@tanstack/react-query'

import { useToast } from '@src/app/providers'
import { authClient } from '@src/services/api/auth-client'
import { Box, Button, OtpInput, ThemedText } from '@src/shared/components'
import { validationMapErrors } from '@src/shared/utils'

import { otpSchema, SendVerificationEmailForm } from '../domain'
import { useEmailVerificationSession } from '../hooks'

type AuthVerifyEmailProps = {
  emailToBeVerified: string
  passwordToSignIn?: string
  hideTitle?: boolean
  isActive?: boolean
  sendCodeOnActive?: boolean
}

export const AuthVerifyEmail: React.FC<AuthVerifyEmailProps> = ({
  emailToBeVerified,
  passwordToSignIn,
  hideTitle,
  isActive = true,
  sendCodeOnActive = true
}) => {
  const { showToast } = useToast()
  const { resolveEmailVerificationSession } = useEmailVerificationSession()
  const automaticallySentEmailRef = useRef<string | null>(null)

  const [isResendDisabled, setIsResendDisabled] = useState(false)
  const [countdown, setCountdown] = useState(30)
  const [form, setForm] = useState<SendVerificationEmailForm>({
    otp: ''
  })

  const [formError, setFormError] = useState<SendVerificationEmailForm>({
    otp: ''
  })

  const handleChangeInputValue = (value: string) => {
    setFormError({ otp: '' })
    setForm({ otp: value })
  }

  const validateVerifyEmailSchema = (otp: string) => {
    setFormError({
      otp: ''
    })
    const values = {
      otp
    }

    const result = otpSchema.safeParse(values)
    if (!result.success) {
      setFormError(validationMapErrors(result.error, formError))
      throw Error
    }
  }

  const handleVerifyEmailError = (error: any) => {
    if (error.code === 'INVALID_OTP') {
      showToast('código inválido', 'error')
      return
    }
    showToast('algo deu errado, tente novamente mais tarde.', 'error')
    return
  }

  const submitForm = async (otp: string) => {
    validateVerifyEmailSchema(otp)

    const { data, error } = await authClient.emailOtp.verifyEmail({
      otp,
      email: emailToBeVerified
    })

    if (error) {
      handleVerifyEmailError(error)
    }

    return data
  }

  const { mutate: submitFormMutation, isPending: isLoading } = useMutation({
    mutationFn: async (otp: string) => submitForm(otp),
    onSuccess: async (data) => {
      if (data) {
        await resolveEmailVerificationSession({
          email: emailToBeVerified,
          password: passwordToSignIn,
          session: data.token ? { token: data.token, user: data.user } : null
        })
      }
    },
    onError: (error) => {
      console.error('todo - add logger', error)
    }
  })

  const handleSendVerificationEmail = useCallback(async () => {
    if (!emailToBeVerified) return

    try {
      await authClient.emailOtp.sendVerificationOtp({
        email: emailToBeVerified,
        type: 'email-verification'
      })

      setCountdown(30)
      setIsResendDisabled(true)
    } catch (error) {
      console.error(error)
    }
  }, [emailToBeVerified])

  useEffect(() => {
    if (!sendCodeOnActive || !isActive || !emailToBeVerified) return
    if (automaticallySentEmailRef.current === emailToBeVerified) return

    automaticallySentEmailRef.current = emailToBeVerified
    handleSendVerificationEmail()
  }, [emailToBeVerified, handleSendVerificationEmail, isActive, sendCodeOnActive])

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
    <Box gap={6}>
      <Box gap={1}>
        {!hideTitle && <ThemedText variant="title">confirme seu email</ThemedText>}
        <ThemedText variant="secondary">enviamos um código para {emailToBeVerified}.</ThemedText>
      </Box>

      <OtpInput
        value={form.otp}
        onChangeText={handleChangeInputValue}
        errorMessage={formError.otp}
        autoFocus={isActive}
        disabled={isLoading || !isActive}
        onComplete={(otp) => submitFormMutation(otp)}
      />

      <Box mt={4} gap={4}>
        <Button variant="ghost" disabled={isResendDisabled || isLoading} onPress={() => handleSendVerificationEmail()}>
          <ThemedText size="lg" weight="semibold">
            {isLoading ? 'verificando...' : isResendDisabled ? `reenviar em ${countdown}s` : 'reenviar código'}
          </ThemedText>
        </Button>
      </Box>
    </Box>
  )
}
